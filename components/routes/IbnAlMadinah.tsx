'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types';
import { ChatMessage, ConversationState, UserPreferences } from '@/types/route';
import { RouteResult } from '@/types/route';
import { generateSuggestedRoute, MADINAH_CENTER, buildRouteNearestNeighbor } from '@/lib/routeUtils';
import { useAuthStore } from '@/lib/store';

interface IbnAlMadinahProps {
  places: Place[];
  onRouteGenerated: (route: RouteResult, selectedPlaces: Place[], suggestions: { place: Place; reason: string }[]) => void;
}

export default function IbnAlMadinah({ places, onRouteGenerated }: IbnAlMadinahProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'duration',
    preferences: {},
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [aiSuggestedPlaces, setAiSuggestedPlaces] = useState<{ id: string; name: string; reason: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check for pending conversation after login
  useEffect(() => {
    if (user) {
      const pendingConversation = localStorage.getItem('pendingIbnConversation');
      if (pendingConversation) {
        try {
          const data = JSON.parse(pendingConversation);
          setMessages(data.messages || []);
          setConversationState(data.conversationState || { step: 'duration', preferences: {} });
          localStorage.removeItem('pendingIbnConversation');
        } catch (e) {
          console.error('Error parsing pending conversation:', e);
        }
      }
    }
  }, [user]);

  // Initialize with welcome message (only if logged in)
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: 'أهلاً بك! أنا ابن المدينة، أساعدك في بناء مسار مناسب لك في المدينة المنورة. 🕌\n\nأخبرني أولاً، كم مدة إقامتك في المدينة؟ (يوم واحد، يومين، أكثر...)',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Prevent page scroll when input is focused
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleFocus = () => {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    const handleBlur = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Auto-scroll to bottom only when new messages are added (not on every render)
  const prevMessagesLengthRef = useRef(0);
  useEffect(() => {
    const currentLength = messages.length;
    const hasNewMessage = currentLength > prevMessagesLengthRef.current;
    
    // Only scroll if:
    // 1. New message was actually added (length increased)
    // 2. Not currently typing (to avoid scroll during typing indicator)
    // 3. Messages exist
    if (hasNewMessage && !isTyping && currentLength > 0) {
      // Small delay to ensure DOM is updated
      const scrollTimer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
      
      prevMessagesLengthRef.current = currentLength;
      
      return () => clearTimeout(scrollTimer);
    } else {
      prevMessagesLengthRef.current = currentLength;
    }
  }, [messages.length, isTyping]); // Only depend on length, not full messages array

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = async (callback: () => void | Promise<void>) => {
    setIsTyping(true);
    try {
      // Show typing indicator for at least 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Execute callback (API call)
      await callback();
    } finally {
      // Always hide typing indicator after callback completes
      setIsTyping(false);
    }
  };

  // Helper function to check if text contains any of the keywords
  const containsAny = (text: string, keywords: string[]): boolean => {
    return keywords.some(keyword => text.includes(keyword));
  };

  // Helper function to extract age from text
  const extractAge = (text: string): number | null => {
    // Look for numbers
    const numbers = text.match(/\d+/);
    if (numbers) {
      const age = parseInt(numbers[0]);
      if (age >= 1 && age <= 120) return age;
    }
    
    // Look for age-related words
    if (containsAny(text, ['عشرين', '20', 'العشرين'])) return 20;
    if (containsAny(text, ['ثلاثين', '30', 'الثلاثين'])) return 30;
    if (containsAny(text, ['أربعين', '40', 'الأربعين'])) return 40;
    if (containsAny(text, ['خمسين', '50', 'الخمسين'])) return 50;
    if (containsAny(text, ['ستين', '60', 'الستين'])) return 60;
    
    return null;
  };

  // Helper function to detect trip type
  const detectTripType = (text: string): 'individual' | 'family' | null => {
    // Individual indicators (must check these first to avoid conflicts)
    const individualKeywords = [
      'لحالي', 'لنفسي', 'وحدي', 'واحدي', 'فردي', 'فردية', 'شخصي', 'شخصية',
      'أنا', 'أنا لوحدي', 'أنا وحدي', 'بمفردي', 'مفردي', 'مفردة',
      'بدون عائلة', 'بدون أسرة', 'ليس معي أحد', 'لا أحد معي'
    ];
    if (containsAny(text, individualKeywords)) {
      return 'individual';
    }

    // Family indicators
    const familyKeywords = [
      'عائل', 'أسرة', 'اسرة', 'أهل', 'عائلة', 'مع العائلة', 'مع الأسرة',
      'مع أهلي', 'مع زوجتي', 'مع زوجي', 'مع أولادي', 'مع أطفالي',
      'أنا وعائلتي', 'أنا وأسرتي', 'أنا وأهلي'
    ];
    if (containsAny(text, familyKeywords)) {
      return 'family';
    }

    return null;
  };

  // Helper function to detect kids
  const detectKids = (text: string): boolean => {
    const kidsKeywords = [
      'طفل', 'أطفال', 'صغار', 'أولاد', 'بنات', 'صغير', 'صغيرة',
      'مع أطفالي', 'مع أولادي', 'مع بناتي', 'مع أبنائي'
    ];
    return containsAny(text, kidsKeywords);
  };

  // Helper function to detect seniors
  const detectSeniors = (text: string): boolean => {
    const seniorsKeywords = [
      'كبار', 'مسن', 'مسنة', 'والد', 'والدة', 'أب', 'أم', 'جد', 'جدة',
      'والدي', 'والدتي', 'أبي', 'أمي', 'جدي', 'جدتي', 'كبير', 'كبيرة'
    ];
    return containsAny(text, seniorsKeywords);
  };

  // Helper function to detect place types
  const detectPlaceTypes = (text: string): ('religious' | 'historical' | 'entertainment')[] => {
    const types: ('religious' | 'historical' | 'entertainment')[] = [];
    
    const religiousKeywords = [
      'دين', 'ديني', 'دينية', 'مسجد', 'مساجد', 'إسلام', 'إسلامي', 'إسلامية',
      'روحان', 'روحاني', 'روحانية', 'عبادة', 'صلاة', 'زيارة', 'زيارات'
    ];
    if (containsAny(text, religiousKeywords)) {
      types.push('religious');
    }

    const historicalKeywords = [
      'تاريخ', 'تاريخي', 'تاريخية', 'متحف', 'متاحف', 'معلم', 'معالم',
      'تراث', 'تراثي', 'تراثية', 'قديم', 'قديمة', 'أثري', 'أثرية'
    ];
    if (containsAny(text, historicalKeywords)) {
      types.push('historical');
    }

    const entertainmentKeywords = [
      'ترفيه', 'ترفيهي', 'ترفيهية', 'حديقة', 'حدائق', 'مول', 'مولات',
      'تسوق', 'تسوقي', 'لعب', 'ألعاب', 'استجمام', 'راحة', 'استرخاء'
    ];
    if (containsAny(text, entertainmentKeywords)) {
      types.push('entertainment');
    }

    // If user says "كل" or "جميع" or nothing specific, include all
    if (containsAny(text, ['كل', 'جميع', 'كلها', 'كلهم', 'الكل']) || types.length === 0) {
      return ['religious', 'historical', 'entertainment'];
    }

    return types;
  };

  // Helper function to detect number of places
  const detectNumberOfPlaces = (text: string): 1 | 2 | 3 => {
    if (containsAny(text, ['واحد', '1', 'مكان واحد', 'مكان واحد فقط', 'واحدة'])) {
      return 1;
    }
    if (containsAny(text, ['ثلاث', 'ثلاثة', '3', 'ثلاث أماكن', 'شامل', 'كثير'])) {
      return 3;
    }
    // Default to 2
    return 2;
  };

  // ============================================
  // FALLBACK: Simple keyword-based logic (used only if AI API fails)
  // ============================================
  const processUserInput = (userInput: string) => {
    const input = userInput.toLowerCase().trim();
    const newPreferences = { ...conversationState.preferences };
    let nextStep = conversationState.step;
    let response = '';
    let processedCurrentStep = false;

    // Process current step and potentially next steps if user answered multiple questions
    switch (conversationState.step) {
      case 'duration':
        // Extract duration info
        newPreferences.duration = userInput;
        nextStep = 'tripType';
        processedCurrentStep = true;
        response = 'جميل! 😊\n\nهل الرحلة فردية أم عائلية؟ وهل معكم أطفال أو كبار سن؟';
        
        // Check if user also answered trip type in the same message
        const tripType = detectTripType(input);
        if (tripType) {
          newPreferences.tripType = tripType;
          if (detectKids(input)) newPreferences.hasKids = true;
          if (detectSeniors(input)) newPreferences.hasSeniors = true;
          
          // If they answered trip type, move to age
          nextStep = 'age';
          response = `${tripType === 'family' ? 'رائع، رحلة عائلية! 👨‍👩‍👧‍👦' : 'ممتاز، رحلة فردية! 👤'}\n\nكم عمرك؟ (هذا يساعدني في اقتراح الأماكن المناسبة لك)`;
        }
        break;

      case 'tripType':
        // Parse trip type and companions
        const detectedTripType = detectTripType(input);
        if (detectedTripType) {
          newPreferences.tripType = detectedTripType;
        } else {
          // Default based on other indicators
          if (detectKids(input) || detectSeniors(input)) {
            newPreferences.tripType = 'family';
          } else {
            newPreferences.tripType = 'individual';
          }
        }

        if (detectKids(input)) {
          newPreferences.hasKids = true;
        }

        if (detectSeniors(input)) {
          newPreferences.hasSeniors = true;
        }

        nextStep = 'age';
        processedCurrentStep = true;
        response = `${newPreferences.tripType === 'family' ? 'رائع، رحلة عائلية! 👨‍👩‍👧‍👦' : 'ممتاز، رحلة فردية! 👤'}\n\nكم عمرك؟ (هذا يساعدني في اقتراح الأماكن المناسبة لك)`;
        break;

      case 'age':
        // Extract age
        const age = extractAge(input);
        if (age !== null) {
          newPreferences.age = age;
        } else {
          // Store the input anyway, might be useful
          newPreferences.age = 30; // Default age
        }
        nextStep = 'placeTypes';
        processedCurrentStep = true;
        response = `ممتاز! 👍\n\nما نوع الأماكن التي تفضل زيارتها؟\n• دينية (المساجد والمواقع الإسلامية)\n• تاريخية (المتاحف والمعالم)\n• ترفيهية (الحدائق والمولات)\n\nيمكنك اختيار أكثر من نوع!`;
        
        // Check if user also answered place types
        const types = detectPlaceTypes(input);
        if (types.length > 0) {
          newPreferences.preferredTypes = types;
          nextStep = 'numberOfPlaces';
          const typesAr = types.map((t) => {
            if (t === 'religious') return 'دينية';
            if (t === 'historical') return 'تاريخية';
            return 'ترفيهية';
          }).join(' و ');
          response = `ممتاز! 👍\n\nاختيار رائع! أماكن ${typesAr} 🌟\n\nكم عدد الأماكن التي تود زيارتها في المسار الواحد؟\n• مكان واحد (تجربة مركزة)\n• مكانين (توازن جيد)\n• ثلاثة أماكن (استكشاف شامل)`;
        }
        break;

      case 'placeTypes':
        // Parse place types
        const detectedTypes = detectPlaceTypes(input);
        if (detectedTypes.length > 0) {
          newPreferences.preferredTypes = detectedTypes;
        } else {
          // Default to all if nothing detected
          newPreferences.preferredTypes = ['religious', 'historical', 'entertainment'];
        }
        nextStep = 'numberOfPlaces';
        processedCurrentStep = true;
        
        const typesAr = newPreferences.preferredTypes.map((t) => {
          if (t === 'religious') return 'دينية';
          if (t === 'historical') return 'تاريخية';
          return 'ترفيهية';
        }).join(' و ');
        
        response = `اختيار رائع! أماكن ${typesAr} 🌟\n\nكم عدد الأماكن التي تود زيارتها في المسار الواحد؟\n• مكان واحد (تجربة مركزة)\n• مكانين (توازن جيد)\n• ثلاثة أماكن (استكشاف شامل)`;
        
        // Check if user also answered number of places
        const numPlaces = detectNumberOfPlaces(input);
        if (numPlaces) {
          newPreferences.numberOfPlaces = numPlaces;
          nextStep = 'complete';
          response = `ممتاز! الآن أصبح لدي صورة واضحة عن تفضيلاتك. 🎯\n\n📋 ملخص تفضيلاتك:\n• المدة: ${newPreferences.duration || 'غير محدد'}\n• نوع الرحلة: ${newPreferences.tripType === 'family' ? 'عائلية' : 'فردية'}${newPreferences.hasKids ? ' (معكم أطفال)' : ''}${newPreferences.hasSeniors ? ' (معكم كبار سن)' : ''}\n• العمر: ${newPreferences.age || 'غير محدد'} سنة\n• نوع الأماكن: ${typesAr}\n• عدد الأماكن: ${numPlaces} ${numPlaces === 1 ? 'مكان' : 'أماكن'}\n\nاضغط على زر "إنشاء مسار مقترح" وسأقوم بتحضير أفضل مسار لك! 🚀`;
          setShowGenerateButton(true);
        }
        break;

      case 'numberOfPlaces':
        // Parse number of places
        const detectedNumPlaces = detectNumberOfPlaces(input);
        newPreferences.numberOfPlaces = detectedNumPlaces;
        nextStep = 'complete';
        processedCurrentStep = true;
        
        const summaryTypes = newPreferences.preferredTypes?.map((t) => {
          if (t === 'religious') return 'دينية';
          if (t === 'historical') return 'تاريخية';
          return 'ترفيهية';
        }).join(' و ') || 'متنوعة';
        
        response = `ممتاز! الآن أصبح لدي صورة واضحة عن تفضيلاتك. 🎯\n\n📋 ملخص تفضيلاتك:\n• المدة: ${newPreferences.duration || 'غير محدد'}\n• نوع الرحلة: ${newPreferences.tripType === 'family' ? 'عائلية' : 'فردية'}${newPreferences.hasKids ? ' (معكم أطفال)' : ''}${newPreferences.hasSeniors ? ' (معكم كبار سن)' : ''}\n• العمر: ${newPreferences.age || 'غير محدد'} سنة\n• نوع الأماكن: ${summaryTypes}\n• عدد الأماكن: ${detectedNumPlaces} ${detectedNumPlaces === 1 ? 'مكان' : 'أماكن'}\n\nاضغط على زر "إنشاء مسار مقترح" وسأقوم بتحضير أفضل مسار لك! 🚀`;
        setShowGenerateButton(true);
        break;

      default:
        response = 'شكراً لك! يمكنك الآن إنشاء المسار المقترح.';
    }

    setConversationState({
      step: nextStep,
      preferences: newPreferences,
    });

    return response;
  };

  const handleSend = async () => {
    if (!user) {
      // Should not happen if UI is correct, but just in case
      return;
    }

    if (!input.trim()) return;

    const userInput = input.trim();
    setInput('');
    addMessage('user', userInput);

    simulateTyping(async () => {
      try {
        // Try AI-powered response first
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.concat([
              { id: Date.now().toString(), role: 'user', content: userInput, timestamp: new Date() }
            ]),
            conversationState,
          }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const result = await response.json();

        if (result.success && result.data) {
          const aiResponse = result.data;
          
          // Update conversation state with AI-extracted preferences
          const newPreferences = { ...conversationState.preferences };
          if (aiResponse.preferences) {
            const prefs = aiResponse.preferences as any;
            // Map AI preferences to our format
            if (prefs.stay_duration_days !== null && prefs.stay_duration_days !== undefined) {
              newPreferences.duration = String(prefs.stay_duration_days);
            }
            if (prefs.trip_type !== null && prefs.trip_type !== undefined) {
              newPreferences.tripType = prefs.trip_type === 'عائلية' || prefs.trip_type === 'family' ? 'family' : 
                                       prefs.trip_type === 'أصدقاء' || prefs.trip_type === 'friends' ? 'individual' : 'individual';
            }
            if (prefs.has_kids !== null && prefs.has_kids !== undefined) {
              newPreferences.hasKids = prefs.has_kids;
            }
            if (prefs.has_seniors !== null && prefs.has_seniors !== undefined) {
              newPreferences.hasSeniors = prefs.has_seniors;
            }
            if (prefs.age_group !== null && prefs.age_group !== undefined) {
              // Extract age from age_group if possible
              const ageMatch = String(prefs.age_group).match(/\d+/);
              if (ageMatch) {
                newPreferences.age = parseInt(ageMatch[0]);
              }
            }
            if (prefs.preferred_place_types && Array.isArray(prefs.preferred_place_types) && prefs.preferred_place_types.length > 0) {
              newPreferences.preferredTypes = prefs.preferred_place_types.map((type: string) => {
                if (type.includes('ديني') || type === 'religious') return 'religious';
                if (type.includes('تاريخي') || type === 'historical') return 'historical';
                if (type.includes('ترفيهي') || type === 'entertainment') return 'entertainment';
                return 'religious';
              }) as ('religious' | 'historical' | 'entertainment')[];
            }
            if (prefs.max_places !== null && prefs.max_places !== undefined) {
              newPreferences.numberOfPlaces = prefs.max_places as 1 | 2 | 3;
            }
          }

          setConversationState({
            step: aiResponse.conversation_step || conversationState.step,
            preferences: newPreferences,
          });

          // Save AI-suggested places if provided
          if (aiResponse.suggested_places && Array.isArray(aiResponse.suggested_places) && aiResponse.suggested_places.length > 0) {
            setAiSuggestedPlaces(aiResponse.suggested_places);
            console.log('[IbnAlMadinah] AI suggested places:', aiResponse.suggested_places);
            // If AI suggested places, show generate button
            setShowGenerateButton(true);
          }

          // Show generate button if conversation is complete OR if AI suggested places
          if (aiResponse.next_action === 'generate_route' || 
              aiResponse.conversation_step === 'complete' ||
              (aiResponse.suggested_places && aiResponse.suggested_places.length > 0)) {
            setShowGenerateButton(true);
            console.log('[IbnAlMadinah] Showing generate button. next_action:', aiResponse.next_action, 'step:', aiResponse.conversation_step, 'places:', aiResponse.suggested_places?.length);
          }

          // Display AI response
          addMessage('assistant', aiResponse.response);
        } else {
          throw new Error('Invalid AI response');
        }
      } catch (error) {
        console.error('[IbnAlMadinah] AI request failed, falling back to simple logic:', error);
        // Fallback to simple keyword-based logic
        const response = processUserInput(userInput);
        addMessage('assistant', response);
      }
    });
  };

  const handleLogin = () => {
    // Save current state if any
    if (messages.length > 0) {
      localStorage.setItem('pendingIbnConversation', JSON.stringify({
        messages,
        conversationState,
      }));
    }
    localStorage.setItem('pendingRouteRedirect', '/routes');
    router.push('/login');
  };

  const handleGenerateRoute = () => {
    // Check if user is logged in
    if (!user) {
      // Save conversation state for after login
      localStorage.setItem('pendingIbnConversation', JSON.stringify({
        messages,
        conversationState,
        aiSuggestedPlaces,
      }));
      localStorage.setItem('pendingRouteRedirect', '/routes');
      router.push('/login');
      return;
    }

    // Use AI-suggested places if available, otherwise use fallback logic
    let selectedPlaces: Place[] = [];
    let suggestions: { place: Place; reason: string }[] = [];

    if (aiSuggestedPlaces.length > 0) {
      // Use AI-suggested places
      console.log('[IbnAlMadinah] Using AI-suggested places:', aiSuggestedPlaces);
      
      selectedPlaces = aiSuggestedPlaces
        .map((aiPlace) => {
          const place = places.find((p) => p.id === aiPlace.id);
          if (place) {
            return { place, reason: aiPlace.reason || 'مقترح من ابن المدينة' };
          }
          return null;
        })
        .filter((item): item is { place: Place; reason: string } => item !== null)
        .map((item) => item.place);

      suggestions = aiSuggestedPlaces
        .map((aiPlace) => {
          const place = places.find((p) => p.id === aiPlace.id);
          if (place) {
            return { place, reason: aiPlace.reason || 'مقترح من ابن المدينة' };
          }
          return null;
        })
        .filter((item): item is { place: Place; reason: string } => item !== null);

      // If we couldn't find all AI-suggested places, fill with fallback
      if (selectedPlaces.length < aiSuggestedPlaces.length) {
        console.warn('[IbnAlMadinah] Some AI-suggested places not found, using fallback');
        const { route: fallbackRoute, suggestions: fallbackSuggestions } = generateSuggestedRoute(
          places,
          conversationState.preferences,
          MADINAH_CENTER.latitude,
          MADINAH_CENTER.longitude
        );
        // Combine AI suggestions with fallback
        const existingIds = new Set(selectedPlaces.map((p) => p.id));
        const additionalPlaces = fallbackSuggestions
          .filter((s) => !existingIds.has(s.place.id))
          .slice(0, aiSuggestedPlaces.length - selectedPlaces.length);
        selectedPlaces.push(...additionalPlaces.map((s) => s.place));
        suggestions.push(...additionalPlaces);
      }

      // Generate route with selected places
      const route = buildRouteNearestNeighbor(
        MADINAH_CENTER.latitude,
        MADINAH_CENTER.longitude,
        'مركز المدينة',
        selectedPlaces
      );
      onRouteGenerated(route, selectedPlaces, suggestions);
    } else {
      // Fallback to original logic if no AI suggestions
      console.log('[IbnAlMadinah] No AI suggestions, using fallback logic');
      const { route, suggestions: fallbackSuggestions } = generateSuggestedRoute(
        places,
        conversationState.preferences,
        MADINAH_CENTER.latitude,
        MADINAH_CENTER.longitude
      );
      selectedPlaces = fallbackSuggestions.map((s) => s.place);
      suggestions = fallbackSuggestions;
      onRouteGenerated(route, selectedPlaces, suggestions);
    }

    // Add confirmation message
    const placesText = suggestions
      .map((s, i) => `${i + 1}. ${s.place.name} - ${s.reason}`)
      .join('\n');

    addMessage(
      'assistant',
      `🎉 تم إنشاء المسار المقترح لك!\n\nالأماكن المختارة:\n${placesText}\n\nيمكنك رؤية المسار على الخريطة أدناه. أتمنى لك رحلة ممتعة في المدينة المنورة! 🕌✨`
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation(); // Prevent page scroll
      if (!isTyping && input.trim()) {
        handleSend();
      }
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-l from-primary-600 to-primary-700 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🧔
            </div>
            <div>
              <h3 className="font-bold text-lg">ابن المدينة</h3>
              <p className="text-sm text-primary-100">مساعدك الذكي لاكتشاف المدينة</p>
            </div>
          </div>
        </div>

        {/* Login Prompt */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              تسجيل الدخول مطلوب
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              للاستفادة من مساعد ابن المدينة الذكي، يرجى تسجيل الدخول أولاً. سيساعدك المساعد في بناء أفضل مسار يناسب تفضيلاتك في المدينة المنورة.
            </p>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-l from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg"
            >
              <span>🔑</span>
              <span>تسجيل الدخول</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              بعد تسجيل الدخول، ستعود هنا تلقائياً
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg overflow-hidden"
      style={{
        position: 'relative',
        isolation: 'isolate'
      }}
      onWheel={(e) => {
        // Prevent wheel events from bubbling to page
        e.stopPropagation();
      }}
      onScroll={(e) => {
        // Prevent scroll events from bubbling to page
        e.stopPropagation();
      }}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-700 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
            🧔
          </div>
          <div>
            <h3 className="font-bold text-lg">ابن المدينة</h3>
            <p className="text-sm text-primary-100">مساعدك الذكي لاكتشاف المدينة</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        id="chat-messages-container"
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ 
          overscrollBehavior: 'contain', // Prevent scroll chaining to parent
          scrollBehavior: 'smooth',
          position: 'relative',
          isolation: 'isolate' // Create new stacking context
        }}
        onScroll={(e) => {
          // Prevent scroll event from bubbling to parent
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onWheel={(e) => {
          // Prevent wheel event from bubbling to parent
          e.stopPropagation();
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                  <span>🧔</span>
                  <span>ابن المدينة</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator - Always on right (from bot) */}
        {isTyping && (
          <div className="flex justify-end animate-fade-in">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 rounded-bl-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Generate Button */}
      {showGenerateButton && (
        <div className="px-4 py-2 bg-white border-t">
          <button
            onClick={handleGenerateRoute}
            className="w-full bg-gradient-to-l from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
          >
            <span>✨</span>
            إنشاء مسار مقترح
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Prevent page scroll when typing
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onKeyDown={(e) => {
              // Prevent page scroll on Enter
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                if (!isTyping && input.trim()) {
                  handleSend();
                }
                return false;
              } else {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }
            }}
            onKeyPress={(e) => {
              // Prevent default scroll behavior
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                return false;
              }
            }}
            onKeyUp={(e) => {
              // Prevent any key events from causing page scroll
              e.stopPropagation();
            }}
            placeholder="اكتب ردك هنا..."
            className="flex-1 input-field focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isTyping}
            autoFocus={false}
            onFocus={(e) => {
              // Prevent page scroll when input is focused
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              // Prevent body scroll
              const chatContainer = document.getElementById('chat-messages-container');
              if (chatContainer) {
                chatContainer.focus();
              }
            }}
            onBlur={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              // Prevent click from causing page scroll
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              handleSend();
            }}
            disabled={!input.trim() || isTyping}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

