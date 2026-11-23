export interface QuizQuestion {
  id: string;
  question: string;
  teluguQuestion?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface CurriculumLesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'Video Lesson' | 'Interactive Notes' | 'Audio Class' | 'Practice Lab';
  summary: string;
  keyTakeaways: string[];
  quizQuestions: QuizQuestion[];
}

export interface CurriculumChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  lessons: CurriculumLesson[];
}

export interface SubjectDocument {
  id?: string;
  name: string;
  level: string;
  class?: string;
  course?: string;
  semester?: number;
  language: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  level?: string;
  class?: string;
  semester?: string | number;
  language?: string;
  code?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
  topics?: string[]; // Backward compatibility helper
  chapters: CurriculumChapter[];
}

export interface CurriculumClass {
  id: string;
  name: string;
  description?: string;
  subjects: CurriculumSubject[];
}

export interface EducationLevel {
  id: string;
  name: string;
  category: 'Early Childhood' | 'Primary School' | 'High School' | 'Higher Secondary' | 'Undergraduate Degree';
  icon: string;
  color: string;
  description: string;
  classes: CurriculumClass[];
  subTree?: CurriculumClass[]; // Alias for backward compatibility
}

// Backward compatibility type aliases
export type CurriculumBranch = CurriculumClass;
export type CurriculumLevel = EducationLevel;

export const EDUAI_6_TIER_CURRICULUM: EducationLevel[] = [
  {
    id: 'lkg',
    name: 'LKG',
    category: 'Early Childhood',
    icon: 'Baby',
    color: 'from-pink-500 to-rose-600',
    description: 'Foundational early learning for toddlers focusing on phonics, basic counting, motor skills, and sensory exploration.',
    classes: [
      {
        id: 'lkg-class',
        name: 'LKG (Lower Kindergarten)',
        description: '3-4 years age group nursery curriculum with interactive audio-visual modules.',
        subjects: [
          {
            id: 'lkg-eng',
            name: 'English & Phonics',
            code: 'LKG-ENG',
            description: 'Alphabet identification, phonic sound association, nursery rhymes, and stroke writing.',
            topics: ['Phonics A to Z Sounds', 'Rhymes & Singing', 'Picture Vocabulary', 'Line Tracing & Curves'],
            chapters: [
              {
                id: 'lkg-eng-ch1',
                chapterNumber: 1,
                title: 'Alphabet Phonics & Letter A-G',
                description: 'Recognizing uppercase and lowercase A to G with phonic sounds and object association.',
                estimatedHours: 4,
                lessons: [
                  {
                    id: 'lkg-eng-ch1-l1',
                    title: 'Letter A: Phonics, Apple & Ant',
                    durationMinutes: 10,
                    type: 'Video Lesson',
                    summary: 'Learn the /æ/ sound for letter A with interactive animation cards.',
                    keyTakeaways: ['A says /æ/ as in Apple', 'Tracing Letter A strokes', 'Singing A phonic song'],
                    quizQuestions: [
                      {
                        id: 'q1',
                        question: 'Which word starts with the letter A?',
                        teluguQuestion: 'A అక్షరంతో ప్రారంభమయ్యే పదం ఏది?',
                        options: ['Apple', 'Ball', 'Cat', 'Dog'],
                        correctIndex: 0,
                        explanation: 'Apple begins with the letter A and makes the /æ/ sound.',
                        difficulty: 'Easy',
                      },
                      {
                        id: 'q2',
                        question: 'What sound does the Letter A make?',
                        teluguQuestion: 'A అక్షరం ఎలాంటి శబ్దం చేస్తుంది?',
                        options: ['/æ/ as in Apple', '/b/ as in Ball', '/k/ as in Cat', '/d/ as in Dog'],
                        correctIndex: 0,
                        explanation: 'Letter A makes the short vowel sound /æ/.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                  {
                    id: 'lkg-eng-ch1-l2',
                    title: 'Letter B: Ball, Boy & Bear',
                    durationMinutes: 12,
                    type: 'Interactive Notes',
                    summary: 'Learn the /b/ sound and practice tracing B curve strokes.',
                    keyTakeaways: ['B says /b/ as in Ball', 'Distinguish B vs D visually'],
                    quizQuestions: [
                      {
                        id: 'q3',
                        question: 'Which picture object starts with B?',
                        options: ['Ball', 'Apple', 'Elephant', 'Fish'],
                        correctIndex: 0,
                        explanation: 'Ball starts with the letter B sound.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'lkg-math',
            name: 'Mathematics',
            code: 'LKG-MTH',
            description: 'Number recognition (1 to 20), shape matching, color identification, and spatial concepts.',
            topics: ['Counting Numbers 1-20', 'Basic Shapes & Colors', 'Patterns & Matching', 'Big / Small'],
            chapters: [
              {
                id: 'lkg-mth-ch1',
                chapterNumber: 1,
                title: 'Numbers 1 to 10 & Fun Shapes',
                description: 'Counting objects 1 to 10 and identifying circles, squares, and triangles.',
                estimatedHours: 5,
                lessons: [
                  {
                    id: 'lkg-mth-ch1-l1',
                    title: 'Counting 1 to 5 with Fruits',
                    durationMinutes: 10,
                    type: 'Video Lesson',
                    summary: 'Count 1 apple, 2 bananas, 3 oranges, 4 mangoes, 5 grapes.',
                    keyTakeaways: ['Count objects sequentially', 'Match number digits to quantity'],
                    quizQuestions: [
                      {
                        id: 'q4',
                        question: 'How many apples are there if you see 🍎🍎🍎?',
                        teluguQuestion: '🍎🍎🍎 ఎన్ని యాపిల్స్ ఉన్నాయి?',
                        options: ['2', '3', '4', '5'],
                        correctIndex: 1,
                        explanation: 'There are 3 apples pictured.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'lkg-evs',
            name: 'Environmental Studies',
            code: 'LKG-EVS',
            description: 'Introducing self, family, body parts, animals, fruits, and daily hygiene habits.',
            topics: ['My Self & My Family', 'Parts of Body', 'Animals & Sounds', 'Fruits & Veggies'],
            chapters: [
              {
                id: 'lkg-evs-ch1',
                chapterNumber: 1,
                title: 'My Body & Healthy Habits',
                description: 'Learn eyes, ears, nose, hands, and brush teeth daily habits.',
                estimatedHours: 3,
                lessons: [
                  {
                    id: 'lkg-evs-ch1-l1',
                    title: 'Parts of the Human Body',
                    durationMinutes: 10,
                    type: 'Audio Class',
                    summary: 'Interactive song identifying eyes to see, ears to hear, and hands to clap.',
                    keyTakeaways: ['Eyes are used to see', 'Ears are used to hear'],
                    quizQuestions: [
                      {
                        id: 'q5',
                        question: 'Which body part do we use to see things?',
                        teluguQuestion: 'వస్తువులను చూడటానికి మనం శరీరంలో ఏ భాగాన్ని ఉపయోగిస్తాము?',
                        options: ['Eyes', 'Ears', 'Nose', 'Hands'],
                        correctIndex: 0,
                        explanation: 'We see with our eyes.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ukg',
    name: 'UKG',
    category: 'Early Childhood',
    icon: 'Sparkles',
    color: 'from-purple-500 to-indigo-600',
    description: 'Upper Kindergarten building CVC sight words, addition, Telugu aksharamala, and general awareness.',
    classes: [
      {
        id: 'ukg-class',
        name: 'UKG (Upper Kindergarten)',
        description: '4-5 years age group foundational literacy and numeracy.',
        subjects: [
          {
            id: 'ukg-eng',
            name: 'English Reading & CVC Words',
            description: 'Vowels & consonants, 3-letter CVC words (cat, dog), simple sentence reading.',
            topics: ['CVC Word Blends', 'Sight Words', 'Action Words', 'Simple Stories'],
            chapters: [
              {
                id: 'ukg-eng-ch1',
                chapterNumber: 1,
                title: 'Short Vowels & CVC Word Families',
                description: '3-letter words like CAT, MAT, BAT, DOG, PIN.',
                estimatedHours: 6,
                lessons: [
                  {
                    id: 'ukg-eng-l1',
                    title: 'The -AT Word Family (Cat, Mat, Hat)',
                    durationMinutes: 12,
                    type: 'Video Lesson',
                    summary: 'Combining consonant + vowel + consonant to form rhyming words.',
                    keyTakeaways: ['C + AT = CAT', 'M + AT = MAT', 'H + AT = HAT'],
                    quizQuestions: [
                      {
                        id: 'q6',
                        question: 'Complete the word: C + AT = ?',
                        options: ['CAT', 'DOG', 'PIN', 'SUN'],
                        correctIndex: 0,
                        explanation: 'C + AT blends to form CAT.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ukg-mth',
            name: 'Mathematics',
            description: 'Numbers up to 100, single-digit addition (+), subtraction (-), and time.',
            topics: ['Numbers 1 to 100', 'Addition (+)', 'Subtraction (-)', 'Days of Week'],
            chapters: [
              {
                id: 'ukg-mth-ch1',
                chapterNumber: 1,
                title: 'Single-Digit Addition & Subtraction',
                description: 'Visual addition with counters and subtraction basics.',
                estimatedHours: 5,
                lessons: [
                  {
                    id: 'ukg-mth-l1',
                    title: 'Adding Single Digit Numbers (2 + 3 = 5)',
                    durationMinutes: 15,
                    type: 'Practice Lab',
                    summary: 'Count total objects when combining two groups.',
                    keyTakeaways: ['Plus sign (+) means add together', '2 dots + 3 dots = 5 dots'],
                    quizQuestions: [
                      {
                        id: 'q7',
                        question: 'What is 3 + 2?',
                        teluguQuestion: '3 + 2 ఎంత?',
                        options: ['4', '5', '6', '7'],
                        correctIndex: 1,
                        explanation: '3 + 2 = 5.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'school',
    name: 'School',
    category: 'High School',
    icon: 'School',
    color: 'from-blue-500 to-teal-600',
    description: 'Comprehensive Class 1 to Class 10 SCERT & CBSE primary to secondary school curriculum.',
    classes: [
      {
        id: 'class-1',
        name: 'Class 1',
        description: 'Foundational literacy, primary arithmetic, EVS, and regional Telugu.',
        subjects: [
          {
            id: 'c1-math',
            name: 'Mathematics',
            description: 'Numbers up to 100, money, shapes, addition and subtraction word problems.',
            topics: ['Numbers 1-99', 'Addition & Subtraction', 'Money & Coins', 'Measurement'],
            chapters: [
              {
                id: 'c1-mth-ch1',
                chapterNumber: 1,
                title: 'Numbers 1 to 99 & Place Value',
                description: 'Tens and ones concept with bundle of sticks.',
                estimatedHours: 6,
                lessons: [
                  {
                    id: 'c1-mth-l1',
                    title: 'Understanding Tens and Ones',
                    durationMinutes: 15,
                    type: 'Video Lesson',
                    summary: '24 consists of 2 Tens (20) and 4 Ones (4).',
                    keyTakeaways: ['1 Ten = 10 units', 'Place value grid'],
                    quizQuestions: [
                      {
                        id: 'q8',
                        question: 'How many Tens are in the number 45?',
                        teluguQuestion: '45 సంఖ్యలో ఎన్ని పదులు ఉన్నాయి?',
                        options: ['4 Tens', '5 Tens', '9 Tens', '0 Tens'],
                        correctIndex: 0,
                        explanation: 'In 45, digit 4 is in the Tens place (4 Tens = 40).',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'c1-evs',
            name: 'Environmental Studies (EVS)',
            description: 'Our house, food, clothes, animals, plants, and safety habits.',
            topics: ['Plants & Animals', 'Our House', 'Air & Water', 'Cleanliness'],
            chapters: [
              {
                id: 'c1-evs-ch1',
                chapterNumber: 1,
                title: 'The Plant Kingdom Around Us',
                description: 'Big trees, shrubs, herbs, and parts of plants.',
                estimatedHours: 4,
                lessons: [
                  {
                    id: 'c1-evs-l1',
                    title: 'Parts of a Plant (Root, Stem, Leaf, Flower)',
                    durationMinutes: 12,
                    type: 'Interactive Notes',
                    summary: 'Roots absorb water from soil while green leaves make food.',
                    keyTakeaways: ['Roots are under ground', 'Leaves make food using sunlight'],
                    quizQuestions: [
                      {
                        id: 'q9',
                        question: 'Which part of the plant grows under the ground and absorbs water?',
                        teluguQuestion: 'మొక్క యొక్క ఏ భాగం నేల భూమి కింద పెరుగుతుంది మరియు నీటిని గ్రహిస్తుంది?',
                        options: ['Root', 'Leaf', 'Flower', 'Fruit'],
                        correctIndex: 0,
                        explanation: 'Roots absorb water and nutrients from the soil.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-2',
        name: 'Class 2',
        description: '2-digit addition with carrying, basic English story comprehension, and local geography.',
        subjects: [
          {
            id: 'c2-math',
            name: 'Mathematics',
            description: 'Numbers up to 1000, 2D/3D shapes, skip counting, and subtraction with borrowing.',
            chapters: [
              {
                id: 'c2-mth-ch1',
                chapterNumber: 1,
                title: 'Numbers 100 to 999 & Place Value',
                description: 'Hundreds, Tens, and Ones breakdown.',
                estimatedHours: 6,
                lessons: [
                  {
                    id: 'c2-mth-l1',
                    title: '3-Digit Number Construction',
                    durationMinutes: 15,
                    type: 'Video Lesson',
                    summary: '3 Hundreds + 4 Tens + 5 Ones = 345.',
                    keyTakeaways: ['Hundreds place representation', 'Expanded notation'],
                    quizQuestions: [
                      {
                        id: 'q2-1',
                        question: 'What is 300 + 40 + 5?',
                        options: ['345', '354', '435', '543'],
                        correctIndex: 0,
                        explanation: '300 + 40 + 5 = 345.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-3',
        name: 'Class 3',
        description: 'Introduction to multiplication tables, general science, and environmental studies.',
        subjects: [
          {
            id: 'c3-math',
            name: 'Mathematics',
            description: 'Multiplication tables 1 to 10, division basics, measurement of length & weight.',
            chapters: [
              {
                id: 'c3-mth-ch1',
                chapterNumber: 1,
                title: 'Multiplication & Equal Groups',
                description: 'Repeated addition concept and 2x, 3x, 5x, 10x tables.',
                estimatedHours: 8,
                lessons: [
                  {
                    id: 'c3-mth-l1',
                    title: 'Multiplication as Repeated Addition',
                    durationMinutes: 18,
                    type: 'Video Lesson',
                    summary: '4 + 4 + 4 = 3 × 4 = 12.',
                    keyTakeaways: ['Symbol × represents multiplication', 'Commutative property: 3×4 = 4×3'],
                    quizQuestions: [
                      {
                        id: 'q3-1',
                        question: 'What is 4 multiplied by 5 (4 × 5)?',
                        options: ['20', '15', '25', '18'],
                        correctIndex: 0,
                        explanation: '4 × 5 = 20.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-4',
        name: 'Class 4',
        description: 'Long division, fractions intro, state geography, and environmental science.',
        subjects: [
          {
            id: 'c4-sci',
            name: 'Science & Environment',
            description: 'States of matter, water cycle, digestive system, and solar energy.',
            chapters: [
              {
                id: 'c4-sci-ch1',
                chapterNumber: 1,
                title: 'The Human Digestive System',
                description: 'Mouth, esophagus, stomach, small intestine, and food absorption.',
                estimatedHours: 7,
                lessons: [
                  {
                    id: 'c4-sci-l1',
                    title: 'Journey of Food in Our Body',
                    durationMinutes: 20,
                    type: 'Video Lesson',
                    summary: 'Chewing food with teeth and saliva digestion in stomach.',
                    keyTakeaways: ['Mouth uses saliva to break down starches', 'Small intestine absorbs nutrients'],
                    quizQuestions: [
                      {
                        id: 'q4-1',
                        question: 'Where does digestion of food begin in the human body?',
                        options: ['Mouth', 'Stomach', 'Small Intestine', 'Liver'],
                        correctIndex: 0,
                        explanation: 'Digestion begins in the mouth where teeth chew food and saliva breaks down carbohydrates.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-5',
        name: 'Class 5',
        description: 'Upper primary milestone prep with fractions, human body systems, solar system.',
        subjects: [
          {
            id: 'c5-mth',
            name: 'Mathematics',
            description: 'Large numbers, fractions, decimals, percentages, perimeter and area.',
            topics: ['Fractions', 'Decimals & Percentages', 'Angles & Triangles', 'Data Handling'],
            chapters: [
              {
                id: 'c5-mth-ch1',
                chapterNumber: 1,
                title: 'Fractions & Operations',
                description: 'Proper, improper, mixed fractions and addition of like fractions.',
                estimatedHours: 8,
                lessons: [
                  {
                    id: 'c5-mth-l1',
                    title: 'Introduction to Equivalent Fractions',
                    durationMinutes: 20,
                    type: 'Video Lesson',
                    summary: '1/2 is equal to 2/4 and 4/8.',
                    keyTakeaways: ['Multiply numerator and denominator by same non-zero number', 'Visual pizza slices comparison'],
                    quizQuestions: [
                      {
                        id: 'q10',
                        question: 'Which fraction is equivalent to 1/2?',
                        teluguQuestion: '1/2కి సమానమైన భిన్నం ఏది?',
                        options: ['2/4', '3/4', '1/3', '2/3'],
                        correctIndex: 0,
                        explanation: '1/2 = (1×2)/(2×2) = 2/4.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-6',
        name: 'Class 6',
        description: 'Middle school transition introducing algebra, integers, physics basics, and Indian history.',
        subjects: [
          {
            id: 'c6-sci',
            name: 'General Science',
            description: 'Components of food, sorting materials, motion and measurement of distances.',
            chapters: [
              {
                id: 'c6-sci-ch1',
                chapterNumber: 1,
                title: 'Components of Food & Balanced Diet',
                description: 'Carbohydrates, proteins, fats, vitamins, minerals, and deficiency diseases.',
                estimatedHours: 8,
                lessons: [
                  {
                    id: 'c6-sci-l1',
                    title: 'Vitamins & Deficiency Diseases',
                    durationMinutes: 20,
                    type: 'Video Lesson',
                    summary: 'Vitamin A deficiency causes night blindness; Vitamin C deficiency causes Scurvy.',
                    keyTakeaways: ['Vitamin A: Night Blindness', 'Vitamin C: Scurvy', 'Vitamin D: Rickets'],
                    quizQuestions: [
                      {
                        id: 'q6-1',
                        question: 'Deficiency of Vitamin C causes which disease?',
                        options: ['Scurvy', 'Rickets', 'Beriberi', 'Goitre'],
                        correctIndex: 0,
                        explanation: 'Lack of Vitamin C causes Scurvy characterized by bleeding gums.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-7',
        name: 'Class 7',
        description: 'Fractions & decimals, heat & temperature, acids & bases, medieval history.',
        subjects: [
          {
            id: 'c7-mth',
            name: 'Mathematics',
            description: 'Integers, algebraic expressions, simple equations, lines and angles.',
            chapters: [
              {
                id: 'c7-mth-ch1',
                chapterNumber: 1,
                title: 'Integers & Number Line Operations',
                description: 'Positive and negative numbers, rules of multiplication (+ × - = -).',
                estimatedHours: 8,
                lessons: [
                  {
                    id: 'c7-mth-l1',
                    title: 'Multiplication of Negative Integers',
                    durationMinutes: 22,
                    type: 'Video Lesson',
                    summary: 'Product of two negative integers is a positive integer (-3 × -4 = +12).',
                    keyTakeaways: ['Negative × Negative = Positive', 'Negative × Positive = Negative'],
                    quizQuestions: [
                      {
                        id: 'q7-1',
                        question: 'What is (-5) × (-6)?',
                        options: ['+30', '-30', '-11', '+11'],
                        correctIndex: 0,
                        explanation: 'Product of two negative integers is positive: (-5) × (-6) = +30.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-8',
        name: 'Class 8',
        description: 'Rational numbers, linear equations in 1 variable, force & pressure, cell structure.',
        subjects: [
          {
            id: 'c8-sci',
            name: 'Physical & Biological Science',
            description: 'Force & pressure, friction, sound, cell structure, synthetic fibers.',
            chapters: [
              {
                id: 'c8-sci-ch1',
                chapterNumber: 1,
                title: 'Cell - Structure and Functions',
                description: 'Plant cell vs Animal cell, cell membrane, nucleus, cytoplasm, and organelles.',
                estimatedHours: 9,
                lessons: [
                  {
                    id: 'c8-sci-l1',
                    title: 'Plant Cell vs Animal Cell Structures',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Plant cells possess rigid cell wall and chloroplasts which animal cells lack.',
                    keyTakeaways: ['Mitochondria = Powerhouse of Cell', 'Chloroplasts perform photosynthesis'],
                    quizQuestions: [
                      {
                        id: 'q8-1',
                        question: 'Which cell organelle is known as the Powerhouse of the Cell?',
                        options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi Apparatus'],
                        correctIndex: 0,
                        explanation: 'Mitochondria produce ATP cellular energy and are called the Powerhouse of the Cell.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-9',
        name: 'Class 9',
        description: 'Foundation for 10th Board: Polynomials, geometry proofs, laws of motion, gravitation.',
        subjects: [
          {
            id: 'c9-phy',
            name: 'Physics & Chemistry',
            description: 'Matter in our surroundings, atoms & molecules, motion, Newton laws of motion.',
            chapters: [
              {
                id: 'c9-phy-ch1',
                chapterNumber: 1,
                title: 'Newton Laws of Motion',
                description: 'Inertia, Momentum (p=mv), F=ma, Action-Reaction equal and opposite.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'c9-phy-l1',
                    title: 'Newton Second Law of Motion (F = ma)',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Force equals mass times acceleration. Derivation from rate of change of momentum.',
                    keyTakeaways: ['F = m × a', 'SI unit of force is Newton (N = kg·m/s²)'],
                    quizQuestions: [
                      {
                        id: 'q9-1',
                        question: 'What force is required to accelerate a 5 kg mass at 2 m/s²?',
                        options: ['10 N', '2.5 N', '7 N', '20 N'],
                        correctIndex: 0,
                        explanation: 'F = m × a = 5 kg × 2 m/s² = 10 N.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'class-10',
        name: 'Class 10',
        description: 'Master syllabus for 10th Board Exam 100/100 target.',
        subjects: [
          {
            id: 'c10-math',
            name: 'Mathematics',
            code: 'MTH-10',
            description: 'Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Trigonometry, Statistics.',
            topics: ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Trigonometry', 'Statistics'],
            chapters: [
              {
                id: 'c10-mth-ch1',
                chapterNumber: 1,
                title: 'Real Numbers & Euclids Lemma',
                description: 'Fundamental Theorem of Arithmetic, Euclid Division Lemma, proving irrationality of √2, √3, √5.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'c10-mth-ch1-l1',
                    title: 'The Fundamental Theorem of Arithmetic',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Every composite number can be expressed uniquely as a product of primes, apart from the order.',
                    keyTakeaways: ['Prime factorization theorem', 'Finding HCF and LCM using prime factors', 'HCF(a,b) × LCM(a,b) = a × b'],
                    quizQuestions: [
                      {
                        id: 'q11',
                        question: 'If HCF(a, b) = 4 and a × b = 120, what is the LCM(a, b)?',
                        teluguQuestion: 'HCF(a, b) = 4 మరియు a × b = 120 అయితే, LCM(a, b) ఎంత?',
                        options: ['30', '480', '16', '120'],
                        correctIndex: 0,
                        explanation: 'Formula: HCF × LCM = Product of two numbers => 4 × LCM = 120 => LCM = 120/4 = 30.',
                        difficulty: 'Medium',
                      },
                      {
                        id: 'q12',
                        question: 'Which of the following numbers is an irrational number?',
                        teluguQuestion: 'క్రింది వాటిలో ఏది కరణీయ సంఖ్య (Irrational number)?',
                        options: ['√2', '√4', '0.75', '3/5'],
                        correctIndex: 0,
                        explanation: '√2 cannot be written as p/q where p, q are integers, so it is irrational.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'c10-mth-ch8',
                chapterNumber: 8,
                title: 'Introduction to Trigonometry',
                description: 'Trigonometric ratios (sin, cos, tan, cosec, sec, cot), specific angle values, and Pythagorean identities.',
                estimatedHours: 12,
                lessons: [
                  {
                    id: 'c10-mth-ch8-l1',
                    title: 'Trigonometric Ratios & Specific Angles (0°, 30°, 45°, 60°, 90°)',
                    durationMinutes: 30,
                    type: 'Video Lesson',
                    summary: 'Deriving sin θ = Opposite / Hypotenuse, cos θ = Adjacent / Hypotenuse, and memorizing the trigonometric table.',
                    keyTakeaways: ['sin 30° = 1/2', 'cos 60° = 1/2', 'tan 45° = 1', 'sin²θ + cos²θ = 1'],
                    quizQuestions: [
                      {
                        id: 'q13',
                        question: 'What is the value of sin 30° + cos 60°?',
                        teluguQuestion: 'sin 30° + cos 60° యొక్క విలువ ఎంత?',
                        options: ['1', '1/2', '√3/2', '2'],
                        correctIndex: 0,
                        explanation: 'sin 30° = 1/2 and cos 60° = 1/2. Therefore, 1/2 + 1/2 = 1.',
                        difficulty: 'Easy',
                      },
                      {
                        id: 'q14',
                        question: 'What is sin²θ + cos²θ equal to for any angle θ?',
                        teluguQuestion: 'ఏదైనా కోణం θ కి sin²θ + cos²θ విలువ దేనికి సమానం?',
                        options: ['1', '0', '2', 'tan θ'],
                        correctIndex: 0,
                        explanation: 'The fundamental trigonometric identity states sin²θ + cos²θ = 1.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'c10-ps',
            name: 'Physical Science (Physics & Chemistry)',
            code: 'PHY-10',
            description: 'Light Reflection & Refraction, Chemical Reactions, Human Eye, Acids Bases & Salts, Electricity.',
            topics: ['Reflection & Refraction', 'Chemical Reactions', 'Human Eye', 'Electricity', 'Carbon Compounds'],
            chapters: [
              {
                id: 'c10-ps-ch1',
                chapterNumber: 1,
                title: 'Light - Reflection & Refraction',
                description: 'Laws of reflection, spherical mirrors (concave & convex), mirror formula 1/f = 1/v + 1/u, lens power.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'c10-ps-ch1-l1',
                    title: 'Spherical Mirrors & Mirror Formula',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Ray diagrams for concave mirror object positions and sign convention.',
                    keyTakeaways: ['1/f = 1/v + 1/u', 'Magnification m = -v/u', 'Concave mirror forms real inverted images except when object is between P and F'],
                    quizQuestions: [
                      {
                        id: 'q15',
                        question: 'Where should an object be placed in front of a concave mirror to get a real, inverted image of the SAME size?',
                        teluguQuestion: 'పుటాకార దర్పణం (Concave mirror) ముందు వస్తువును ఎక్కడ ఉంచితే సమాన పరిమాణంలో ఉన్న నిజ ప్రతిబింబం ఏర్పడుతుంది?',
                        options: ['At Center of Curvature (C)', 'At Focus (F)', 'Between P and F', 'At Infinity'],
                        correctIndex: 0,
                        explanation: 'When object is placed at Center of Curvature C, the image is formed at C, real, inverted and same size.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    category: 'Higher Secondary',
    icon: 'BookMarked',
    color: 'from-amber-500 to-orange-600',
    description: 'Intermediate 1st & 2nd Year (Class 11 & 12) streams (MPC, BiPC, CEC, MEC) with entrance exams.',
    classes: [
      {
        id: 'inter-mpc',
        name: 'MPC Stream (Maths, Physics, Chemistry)',
        description: 'Engineering Entrance Preparation (EAPCET / JEE Main & Advanced).',
        subjects: [
          {
            id: 'mpc-math-1a',
            name: 'Mathematics 1A (Algebra & Trigonometry)',
            code: 'MTH-1A',
            description: 'Functions, Mathematical Induction, Matrices, Trigonometric Ratios, Vector Algebra.',
            topics: ['Functions', 'Matrices', 'Trigonometric Equations', 'Complex Numbers'],
            chapters: [
              {
                id: 'mpc-mth1a-ch3',
                chapterNumber: 3,
                title: 'Matrices & Determinants',
                description: 'Types of matrices, Matrix inversion method, Cramers Rule for solving simultaneous linear equations.',
                estimatedHours: 12,
                lessons: [
                  {
                    id: 'mpc-mth1a-ch3-l1',
                    title: 'Cramers Rule & Matrix Inversion Method',
                    durationMinutes: 35,
                    type: 'Video Lesson',
                    summary: 'Solving 3-variable linear equations using Δ = |A|, x = Δ1/Δ, y = Δ2/Δ, z = Δ3/Δ.',
                    keyTakeaways: ['If Δ ≠ 0, system has unique solution', 'Adjoint matrix computation A⁻¹ = adj(A)/|A|'],
                    quizQuestions: [
                      {
                        id: 'q16',
                        question: 'If determinant |A| = 0 for a system of linear equations AX = B (where B ≠ 0), the system has:',
                        teluguQuestion: 'AX = B రేఖీయ సమీకరణాల వ్యవస్థలో డిటర్మినెంట్ |A| = 0 (మరియు B ≠ 0) అయితే ఆ వ్యవస్థకు:',
                        options: ['No Solution (Inconsistent)', 'Unique Solution', 'Infinitely Many Solutions', 'Two Solutions'],
                        correctIndex: 0,
                        explanation: 'When |A| = 0 and adj(A)·B ≠ 0, the system is inconsistent and has no solution.',
                        difficulty: 'Hard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'inter-bipc',
        name: 'BiPC Stream (Biology, Physics, Chemistry)',
        description: 'Medical & Healthcare Entrance Prep (NEET / EAPCET Medical).',
        subjects: [
          {
            id: 'bipc-bot',
            name: 'Botany & Plant Physiology',
            description: 'Plant diversity, photosynthesis, genetics, molecular biology.',
            topics: ['Plant Diversity', 'Photosynthesis', 'Genetics', 'Biomolecules'],
            chapters: [
              {
                id: 'bipc-bot-ch1',
                chapterNumber: 1,
                title: 'Photosynthesis in Higher Plants',
                description: 'Light reaction, Dark reaction (C3 & C4 pathways), Calvin Cycle, Photorespiration.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'bipc-bot-l1',
                    title: 'Light Reaction & Z-Scheme of Electron Transport',
                    durationMinutes: 30,
                    type: 'Video Lesson',
                    summary: 'Non-cyclic photophosphorylation producing ATP and NADPH in thylakoid membrane.',
                    keyTakeaways: ['Photosystem II (P680) and Photosystem I (P700)', 'Water splitting photolysis yields O₂ gas'],
                    quizQuestions: [
                      {
                        id: 'q17',
                        question: 'Which gas is released during the photolysis of water in photosynthesis?',
                        teluguQuestion: 'కిరణజన్య సంయోగక్రియలో నీటి కాంతి విశ్లేషణ (Photolysis) ద్వారా ఏ వాయువు విడుదలవుతుంది?',
                        options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Hydrogen (H₂)'],
                        correctIndex: 0,
                        explanation: 'Photolysis of water (2H₂O → 4H⁺ + O₂ + 4e⁻) releases Oxygen gas.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'inter-cec',
        name: 'CEC Stream (Civics, Economics, Commerce)',
        description: 'Commerce, Business Studies, Banking & Civil Services foundation stream.',
        subjects: [
          {
            id: 'cec-comm',
            name: 'Commerce & Accountancy',
            description: 'Double entry bookkeeping, trial balance, ledger posting, and business organizations.',
            chapters: [
              {
                id: 'cec-comm-ch1',
                chapterNumber: 1,
                title: 'Double Entry Bookkeeping & Journal Entries',
                description: 'Debit what comes in, Credit what goes out rules of accounting.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'cec-comm-l1',
                    title: 'Golden Rules of Accounting',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Personal, Real, and Nominal account classification and debit/credit rules.',
                    keyTakeaways: ['Real: Debit what comes in, Credit what goes out', 'Nominal: Debit all expenses, Credit all incomes'],
                    quizQuestions: [
                      {
                        id: 'q-cec-1',
                        question: 'What is the golden rule for Nominal Accounts in accounting?',
                        options: ['Debit all expenses & losses, Credit all incomes & gains', 'Debit what comes in, Credit what goes out', 'Debit the receiver, Credit the giver', 'None of the above'],
                        correctIndex: 0,
                        explanation: 'Nominal accounts rule: Debit all expenses/losses and Credit all incomes/gains.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'inter-mec',
        name: 'MEC Stream (Maths, Economics, Commerce)',
        description: 'Actuarial science, CA Foundation, Data Analytics, and Economics stream.',
        subjects: [
          {
            id: 'mec-econ',
            name: 'Economics & Statistics',
            description: 'Microeconomics, demand & supply, national income analysis, and statistical averages.',
            chapters: [
              {
                id: 'mec-econ-ch1',
                chapterNumber: 1,
                title: 'Law of Demand & Elasticity',
                description: 'Price elasticity of demand, demand curve shifts, and consumer equilibrium.',
                estimatedHours: 9,
                lessons: [
                  {
                    id: 'mec-econ-l1',
                    title: 'The Law of Demand',
                    durationMinutes: 22,
                    type: 'Video Lesson',
                    summary: 'Inverse relationship between price and quantity demanded when other factors remain constant.',
                    keyTakeaways: ['Price increases -> Quantity demanded decreases', 'Downward sloping demand curve'],
                    quizQuestions: [
                      {
                        id: 'q-mec-1',
                        question: 'According to the Law of Demand, as price increases, quantity demanded:',
                        options: ['Decreases', 'Increases', 'Remains Constant', 'Becomes Zero'],
                        correctIndex: 0,
                        explanation: 'The Law of Demand states that price and quantity demanded have an inverse relationship.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'degree',
    name: 'Degree',
    category: 'Undergraduate Degree',
    icon: 'Award',
    color: 'from-rose-500 to-red-600',
    description: 'Undergraduate Degree Programs (B.Sc, B.Com, B.A, BCA, BBA & Other Degrees) with Career Skills.',
    classes: [
      {
        id: 'bsc',
        name: 'B.Sc Computer Science',
        description: 'B.Sc Computer Science, Data Science, Artificial Intelligence & Machine Learning degrees.',
        subjects: [
          {
            id: 'bsc-ml',
            name: 'Machine Learning',
            code: 'BSC-CS-501',
            level: 'Degree',
            class: 'B.Sc Computer Science',
            semester: 'Semester 5',
            language: 'English & Telugu',
            description: 'Supervised & unsupervised learning, regression, classification, neural networks, clustering, model evaluation, and Python Scikit-Learn.',
            topics: ['Supervised Learning', 'Unsupervised Learning', 'Bias-Variance Tradeoff', 'Neural Networks & Deep Learning', 'Model Evaluation & Metrics'],
            chapters: [
              {
                id: 'bsc-ml-ch1',
                chapterNumber: 1,
                title: 'Introduction to Machine Learning',
                description: 'Foundations of Machine Learning, Tom Mitchell definition, Supervised vs Unsupervised vs Reinforcement learning, Bias-Variance tradeoff, and Model Evaluation.',
                estimatedHours: 12,
                lessons: [
                  {
                    id: 'bsc-ml-l1',
                    title: 'Introduction to Machine Learning',
                    durationMinutes: 30,
                    type: 'Video Lesson',
                    summary: 'Machine learning enables computational systems to learn patterns autonomously from historical empirical data without being explicitly programmed. Covers Tom Mitchell (T, P, E) task-performance-experience formulation, types of ML paradigms (Supervised, Unsupervised, Semi-supervised, and Reinforcement Learning), hypothesis space search, feature extraction, train-validation-test data splits, loss optimization functions, and bias-variance dilemmas.',
                    keyTakeaways: [
                      'Arthur Samuel (1959): Field of study that gives computers the ability to learn without being explicitly programmed',
                      'Tom Mitchell (1997): A program learns from Experience (E) with respect to Task (T) and Performance measure (P)',
                      'Supervised Learning: Trained on labeled datasets (Regression for continuous targets, Classification for categorical labels)',
                      'Unsupervised Learning: Discovers hidden patterns and groupings in unlabeled data (K-Means, PCA, Hierarchical Clustering)',
                      'Reinforcement Learning: Agent learns optimal policy through trial-and-error rewards and penalties in an environment',
                      'Overfitting vs Underfitting: Balancing High Bias (Underfitting) and High Variance (Overfitting) via Regularization (L1/L2)'
                    ],
                    quizQuestions: [
                      {
                        id: 'ml-q1',
                        question: 'According to Tom Mitchell definition, a computer program is said to learn from experience E with respect to task T and performance measure P if its performance on T:',
                        teluguQuestion: 'టామ్ మిచెల్ నిర్వచనం ప్రకారం, కంప్యూటర్ ప్రోగ్రామ్ టాస్క్ T మరియు పనితీరు కొలమానం P ఆధారంగా అనుభవం E నుండి నేర్చుకుంటుంది అంటే T లో దాని పనితీరు:',
                        options: [
                          'Improves with experience E as measured by P',
                          'Remains constant regardless of data size',
                          'Decreases when exposed to new training sets',
                          'Requires explicit rewriting of algorithmic source code'
                        ],
                        correctIndex: 0,
                        explanation: 'Tom Mitchell (1997) defined ML: "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E."',
                        difficulty: 'Medium'
                      },
                      {
                        id: 'ml-q2',
                        question: 'Which machine learning paradigm uses unlabelled input data to find intrinsic clusters and representations?',
                        teluguQuestion: 'లేబుల్ చేయని డేటా నుండి దాగివున్న సమూహాలు (క్లస్టర్లు) మరియు నమూనాలను కనుగొనడానికి ఏ అభ్యాస విధానం ఉపయోగపడుతుంది?',
                        options: [
                          'Unsupervised Learning',
                          'Supervised Learning',
                          'Reinforcement Learning',
                          'Supervised Classification'
                        ],
                        correctIndex: 0,
                        explanation: 'Unsupervised learning operates on unlabeled input datasets to uncover hidden groupings, density structures, or low-dimensional representations (e.g., K-Means clustering, PCA).',
                        difficulty: 'Easy'
                      },
                      {
                        id: 'ml-q3',
                        question: 'What occurs when a machine learning model learns training data noise too closely and performs poorly on unseen test data?',
                        teluguQuestion: 'ఒక మెషిన్ లెర్నింగ్ మోడల్ ట్రైనింగ్ డేటాలోని శబ్దాన్ని (నాయిస్) ఎక్కువగా నేర్చుకుని, కొత్త టెస్ట్ డేటాపై పేలవంగా పనిచేస్తే దానిని ఏమంటారు?',
                        options: [
                          'Overfitting (High Variance)',
                          'Underfitting (High Bias)',
                          'Optimal Generalization',
                          'Linear Convergence'
                        ],
                        correctIndex: 0,
                        explanation: 'Overfitting occurs when a model captures random noise and training-set idiosyncrasies instead of underlying relationships, yielding high training accuracy but poor validation/test generalization (High Variance).',
                        difficulty: 'Medium'
                      }
                    ]
                  },
                  {
                    id: 'bsc-ml-l2',
                    title: 'Supervised vs Unsupervised Learning Workflows',
                    durationMinutes: 28,
                    type: 'Interactive Notes',
                    summary: 'Detailed architectural comparison of labeled data prediction (Linear Regression, Logistic Regression, SVM) vs pattern discovery (K-Means, DBSCAN, PCA dimensionality reduction).',
                    keyTakeaways: [
                      'Regression predicts continuous values (e.g. house prices, temperature)',
                      'Classification predicts discrete class labels (e.g. spam detection, disease diagnosis)',
                      'Feature scaling (StandardScaler, MinMaxScaler) prevents gradient distortion'
                    ],
                    quizQuestions: [
                      {
                        id: 'ml-q4',
                        question: 'Predicting whether an email is "Spam" or "Not Spam" is an example of which task?',
                        teluguQuestion: 'ఒక ఈమెయిల్ "స్పామ్" లేదా "స్పామ్ కాదు" అని అంచనా వేయడం ఏ రకమైన టాస్క్?',
                        options: ['Binary Classification', 'Linear Regression', 'Clustering', 'Dimensionality Reduction'],
                        correctIndex: 0,
                        explanation: 'Spam filtering outputs one of two discrete classes (Spam/Not Spam), making it a quintessential binary classification task.',
                        difficulty: 'Easy'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'bsc-ml-ch2',
                chapterNumber: 2,
                title: 'Linear & Logistic Regression Models',
                description: 'Ordinary least squares, gradient descent optimization, cost function mathematical formulation, and sigmoid activation.',
                estimatedHours: 14,
                lessons: [
                  {
                    id: 'bsc-ml-l3',
                    title: 'Gradient Descent Optimization Algorithm',
                    durationMinutes: 32,
                    type: 'Practice Lab',
                    summary: 'Iterative parameter updates using learning rate alpha and partial derivatives of MSE loss.',
                    keyTakeaways: [
                      'Weight update rule: w = w - alpha * (dL/dw)',
                      'Learning rate too large causes divergence; too small causes slow convergence',
                      'Stochastic vs Batch vs Mini-batch Gradient Descent'
                    ],
                    quizQuestions: [
                      {
                        id: 'ml-q5',
                        question: 'In Gradient Descent, what happens if the learning rate alpha (α) is set excessively high?',
                        teluguQuestion: 'గ్రేడియంట్ డిసెంట్‌లో లెర్నింగ్ రేట్ ఆల్ఫా (α) చాలా ఎక్కువగా ఉంటే ఏమి జరుగుతుంది?',
                        options: ['The algorithm may overshoot the minimum and diverge', 'It will converge extremely slowly', 'The cost function becomes exactly zero instantly', 'The weights remain unchanged'],
                        correctIndex: 0,
                        explanation: 'An excessively large learning rate causes step sizes to overshoot the global cost minimum, causing oscillations or divergence.',
                        difficulty: 'Medium'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'bsc-dbms',
            name: 'Database Management Systems (DBMS)',
            code: 'BSC-DBMS',
            level: 'Degree',
            class: 'B.Sc Computer Science',
            semester: 'Semester 3',
            language: 'English & Telugu',
            description: 'Relational algebra, SQL queries, ER diagrams, Normalization (1NF, 2NF, 3NF, BCNF), ACID properties.',
            topics: ['Relational Model & SQL', 'Normalization', 'ACID Properties', 'Transactions & Indexing'],
            chapters: [
              {
                id: 'bsc-dbms-ch1',
                chapterNumber: 1,
                title: 'SQL & Relational Algebra',
                description: 'SELECT, WHERE, GROUP BY, JOINs (INNER, LEFT, RIGHT), Subqueries.',
                estimatedHours: 14,
                lessons: [
                  {
                    id: 'bsc-dbms-l1',
                    title: 'SQL JOIN Operations (Inner, Left, Right, Full)',
                    durationMinutes: 35,
                    type: 'Practice Lab',
                    summary: 'Combining data from multiple tables using primary and foreign keys.',
                    keyTakeaways: ['INNER JOIN returns matching rows', 'LEFT JOIN includes all rows from left table'],
                    quizQuestions: [
                      {
                        id: 'q20',
                        question: 'Which SQL JOIN returns all records from the left table and matched records from the right table?',
                        teluguQuestion: 'ఎడమ వైపు టేబుల్ నుండి అన్ని రికార్డులు మరియు కుడి వైపు టేబుల్ నుండి జతకలిసిన రికార్డులను మాత్రమే ఏ SQL జాయిన్ తిరిగి ఇస్తుంది?',
                        options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
                        correctIndex: 0,
                        explanation: 'LEFT JOIN returns all rows from the left table, with NULLs for unmatched right table rows.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'bcom',
        name: 'B.Com (Bachelor of Commerce)',
        description: 'Financial Accounting, Corporate Tax, Costing, Auditing & Banking degree.',
        subjects: [
          {
            id: 'bcom-fin-acc',
            name: 'Financial Accounting',
            description: 'Corporate financial statements, balance sheets, cash flow statements.',
            chapters: [
              {
                id: 'bcom-fa-ch1',
                chapterNumber: 1,
                title: 'Preparation of Final Accounts & Balance Sheet',
                description: 'Trading Account, Profit & Loss Account, and Balance Sheet adjustments.',
                estimatedHours: 12,
                lessons: [
                  {
                    id: 'bcom-fa-l1',
                    title: 'Balance Sheet Structure & Asset Classification',
                    durationMinutes: 30,
                    type: 'Video Lesson',
                    summary: 'Current assets vs Fixed assets; Liabilities and Shareholders Equity.',
                    keyTakeaways: ['Total Assets = Total Liabilities + Equity', 'Liquidity order presentation'],
                    quizQuestions: [
                      {
                        id: 'q-bcom-1',
                        question: 'In a Balance Sheet, which fundamental equation must always hold true?',
                        options: ['Assets = Liabilities + Equity', 'Assets = Income - Expenses', 'Assets = Revenue + Liabilities', 'Liabilities = Assets + Equity'],
                        correctIndex: 0,
                        explanation: 'The fundamental accounting equation is Assets = Liabilities + Equity.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'ba',
        name: 'B.A (Bachelor of Arts)',
        description: 'Political Science, Public Administration, History, Economics & Literature.',
        subjects: [
          {
            id: 'ba-pol-sci',
            name: 'Political Science & Constitutional Law',
            description: 'Indian Constitution, Fundamental Rights, Preamble, and Parliamentary Democracy.',
            chapters: [
              {
                id: 'ba-ps-ch1',
                chapterNumber: 1,
                title: 'Indian Constitution & Fundamental Rights',
                description: 'Articles 12 to 35, Fundamental Rights, Directive Principles of State Policy.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'ba-ps-l1',
                    title: 'Fundamental Rights in Indian Constitution',
                    durationMinutes: 28,
                    type: 'Video Lesson',
                    summary: 'Right to Equality, Freedom, Against Exploitation, Religion, Culture & Constitutional Remedies.',
                    keyTakeaways: ['Article 21: Right to Life & Personal Liberty', 'Writs under Article 32'],
                    quizQuestions: [
                      {
                        id: 'q-ba-1',
                        question: 'Which Article of the Indian Constitution guarantees the Right to Life and Personal Liberty?',
                        options: ['Article 21', 'Article 14', 'Article 19', 'Article 32'],
                        correctIndex: 0,
                        explanation: 'Article 21 states that no person shall be deprived of his life or personal liberty except according to procedure established by law.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'bca',
        name: 'BCA (Bachelor of Computer Applications)',
        description: 'Software Engineering, Web Development, Mobile Apps & Data Structures.',
        subjects: [
          {
            id: 'bca-dsa',
            name: 'Data Structures & Algorithms (DSA)',
            code: 'BCA-DSA',
            description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching algorithms.',
            topics: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Binary Search', 'Sorting & Searching'],
            chapters: [
              {
                id: 'bca-dsa-ch1',
                chapterNumber: 1,
                title: 'Arrays, Time Complexity & Asymptotic Notation',
                description: 'Big O, Big Omega, Big Theta analysis, 1D/2D arrays, memory allocation.',
                estimatedHours: 12,
                lessons: [
                  {
                    id: 'bca-dsa-ch1-l1',
                    title: 'Understanding Big-O Time Complexity',
                    durationMinutes: 30,
                    type: 'Video Lesson',
                    summary: 'Analyzing O(1), O(log N), O(N), O(N log N), O(N²) worst-case growth bounds.',
                    keyTakeaways: ['O(1) constant time array access', 'O(log N) binary search', 'O(N²) nested loops'],
                    quizQuestions: [
                      {
                        id: 'q18',
                        question: 'What is the average time complexity of Binary Search on a sorted array of size N?',
                        teluguQuestion: 'N పరిమాణం ఉన్న క్రమబద్ధీకరించిన అర్రేలో బైనరీ సెర్చ్ యొక్క సరాసరి సమయ కాంప్లెక్సిటీ ఎంత?',
                        options: ['O(log N)', 'O(N)', 'O(1)', 'O(N²)'],
                        correctIndex: 0,
                        explanation: 'Binary Search halves the search space at each step, yielding O(log N) time complexity.',
                        difficulty: 'Medium',
                      },
                      {
                        id: 'q19',
                        question: 'Which Data Structure follows LIFO (Last In First Out) principle?',
                        teluguQuestion: 'ఏ డాటా స్ట్రక్చర్ LIFO (చివర వచ్చినది మొదట వెళ్తుంది) సూత్రాన్ని పాటిస్తుంది?',
                        options: ['Stack', 'Queue', 'Array', 'Linked List'],
                        correctIndex: 0,
                        explanation: 'Stack operates on LIFO (Last In, First Out) via push() and pop() operations.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'bba',
        name: 'BBA (Bachelor of Business Administration)',
        description: 'Business Management, Marketing Strategy, Human Resources & Entrepreneurship.',
        subjects: [
          {
            id: 'bba-mkt',
            name: 'Principles of Marketing & 4 Ps',
            description: 'Product, Price, Place, Promotion, Consumer behavior, digital branding.',
            chapters: [
              {
                id: 'bba-mkt-ch1',
                chapterNumber: 1,
                title: 'The 4 Ps of Marketing Mix',
                description: 'Product positioning, Pricing strategies, Distribution channels & Promotional campaigns.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'bba-mkt-l1',
                    title: 'Understanding Product, Price, Place & Promotion',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'E.J. McCarthy 4 Ps framework for business value creation.',
                    keyTakeaways: ['Product: Features & Quality', 'Price: Cost plus & Value pricing', 'Place: Distribution', 'Promotion: Advertising & PR'],
                    quizQuestions: [
                      {
                        id: 'q-bba-1',
                        question: 'Who introduced the classic 4 Ps framework of Marketing Mix?',
                        options: ['E. Jerome McCarthy', 'Philip Kotler', 'Peter Drucker', 'Adam Smith'],
                        correctIndex: 0,
                        explanation: 'E. Jerome McCarthy proposed the 4 Ps framework in 1960.',
                        difficulty: 'Medium',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'other-degree',
        name: 'Other Degree Programs',
        description: 'B.Tech, B.Pharm, Vocational Degrees & Specialized Diploma courses.',
        subjects: [
          {
            id: 'oth-soft-eng',
            name: 'Software Engineering Principles',
            description: 'Agile development, SDLC models, Git version control, DevOps basics.',
            chapters: [
              {
                id: 'oth-se-ch1',
                chapterNumber: 1,
                title: 'Software Development Life Cycle (SDLC) & Agile',
                description: 'Requirements, Design, Coding, Testing, Deployment, Maintenance.',
                estimatedHours: 10,
                lessons: [
                  {
                    id: 'oth-se-l1',
                    title: 'Agile Scrum Framework & Sprint Planning',
                    durationMinutes: 25,
                    type: 'Video Lesson',
                    summary: 'Iterative sprint cycles, daily standups, backlog grooming.',
                    keyTakeaways: ['Sprint backlog', 'Scrum master role', 'Daily standup 15-minute sync'],
                    quizQuestions: [
                      {
                        id: 'q-oth-1',
                        question: 'What is the recommended time limit for a Daily Scrum / Standup meeting?',
                        options: ['15 minutes', '30 minutes', '1 hour', '45 minutes'],
                        correctIndex: 0,
                        explanation: 'Daily Standup meetings are strictly timeboxed to 15 minutes.',
                        difficulty: 'Easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Alias export for backward compatibility
export const EDUAI_CURRICULUM_TREE = EDUAI_6_TIER_CURRICULUM.map((level) => ({
  ...level,
  subTree: level.classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    description: cls.description,
    subjects: cls.subjects,
  })),
}));

export const SAMPLE_SUBJECT_DOCUMENTS: SubjectDocument[] = [
  {
    id: 'subj-math-10',
    name: 'Mathematics',
    level: 'School',
    class: 'Class 10',
    language: 'English',
    description: 'Class 10 Mathematics',
    icon: 'math_icon',
    isActive: true,
  },
  {
    id: 'subj-ml-degree',
    name: 'Machine Learning',
    level: 'Degree',
    course: 'B.Sc Computer Science',
    semester: 5,
    language: 'English',
    isActive: true,
  },
  {
    id: 'subj-phy-10',
    name: 'Physical Science',
    level: 'School',
    class: 'Class 10',
    language: 'English',
    description: 'Class 10 Physics & Chemistry',
    icon: 'science_icon',
    isActive: true,
  },
  {
    id: 'subj-dsa-bca',
    name: 'Data Structures & Algorithms',
    level: 'Degree',
    course: 'BCA',
    semester: 3,
    class: 'BCA',
    language: 'English',
    description: 'BCA Data Structures & Algorithms',
    icon: 'code_icon',
    isActive: true,
  },
  {
    id: 'subj-eng-lkg',
    name: 'English & Phonics',
    level: 'Early Childhood',
    class: 'LKG',
    language: 'English',
    description: 'LKG English & Phonics Alphabet',
    icon: 'abc_icon',
    isActive: true,
  },
];
