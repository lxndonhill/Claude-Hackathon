import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@lumio.app'
const DEMO_PASSWORD = 'demo1234'

// ---------- Plan data for Alex (Social Skills) ----------

const alexGoals = JSON.stringify([
  {
    id: 'g1',
    description: 'Initiate a greeting or farewell with a familiar peer or adult independently in 4 out of 5 observed opportunities',
    measurementCriteria: '4/5 opportunities per school day, tracked via behavior log',
    timeframe: '6-8 weeks',
    rationale: 'Alex has excellent memory and pattern recognition — teaching scripted social greetings leverages these strengths and reduces cognitive load. Using dinosaur or Minecraft contexts makes practice feel natural and motivating.',
  },
  {
    id: 'g2',
    description: 'Take turns in a structured 2-person game or activity for at least 5 consecutive exchanges without adult prompting',
    measurementCriteria: '5+ consecutive exchanges in 3 of 4 structured sessions per week',
    timeframe: '8-10 weeks',
    rationale: 'Turn-taking in predictable, rule-based activities (like Minecraft-themed card games) aligns with Alex\'s love of structure and pattern-based thinking. Structured formats reduce the unpredictability of social interaction.',
  },
  {
    id: 'g3',
    description: 'Identify and label own emotional state using a visual feelings chart with 80% accuracy across 3 consecutive school days',
    measurementCriteria: '80% correct identification on feeling check-ins, 3 consecutive days',
    timeframe: '4-6 weeks',
    rationale: 'Visual supports are highly effective for visual learners like Alex. A dinosaur-themed feelings chart connects to a preferred interest, making emotional identification engaging and memorable.',
  },
  {
    id: 'g4',
    description: 'Follow a planned transition routine (visual timer + verbal cue) independently in 4 out of 5 daily transitions',
    measurementCriteria: '4/5 transitions per day completed without meltdown or extended prompt',
    timeframe: '4-6 weeks',
    rationale: 'Transitions are a noted challenge for Alex, and loud environments exacerbate this. A predictable two-step cue (visual timer → verbal "2 more minutes") gives Alex the advance warning needed to shift attention without dysregulation.',
  },
])

const alexStrategies = JSON.stringify([
  {
    id: 's1',
    title: 'Dinosaur Social Stories',
    description: 'Create short, illustrated social stories featuring Alex\'s favourite dinosaurs as characters navigating social situations (greetings, turn-taking, joining groups). Read together daily for the first two weeks, then 3x per week.',
    frequency: 'Daily (weeks 1-2), 3x/week thereafter',
    rationale: 'Social stories are an evidence-based strategy for autism; personalising them with dinosaur characters increases engagement and makes abstract social rules concrete for Alex.',
  },
  {
    id: 's2',
    title: 'Visual Timer for Transitions',
    description: 'Use a Time Timer or digital countdown set to 5 minutes before every activity change. Pair with a consistent verbal cue: "5 more minutes on trains/Minecraft, then we do [next activity]."',
    frequency: 'Every transition, every day',
    rationale: 'Predictability is calming for Alex. Visual timers make the abstract concept of "time" concrete — Alex\'s visual learning style makes this particularly effective.',
  },
  {
    id: 's3',
    title: 'Minecraft-Themed Turn-Taking Games',
    description: 'Introduce structured card or board games with a Minecraft theme (e.g., Minecraft card game or custom-made turn cards). Start 1:1 with an adult, then gradually include one peer once Alex is comfortable.',
    frequency: '3x per week, 15-minute sessions',
    rationale: 'Embedding social skills practice in a highly preferred context (Minecraft) reduces resistance and increases motivation. The predictable rules of board games scaffold turn-taking without ambiguous social cues.',
  },
  {
    id: 's4',
    title: 'Zones of Regulation Check-ins',
    description: 'At the start of each school day and after lunch, use a visual Zones chart (green/yellow/red) for Alex to identify current emotional state. If yellow or red, co-develop a coping plan before continuing.',
    frequency: '2x daily',
    rationale: 'Regular check-ins help Alex build self-awareness and give the educator early warning of dysregulation. Alex\'s pattern recognition helps quickly learn the Zones framework.',
  },
  {
    id: 's5',
    title: 'Noise-Reducing Supports',
    description: 'Provide noise-canceling headphones or foam earplugs during transitions between loud environments (hallways, lunchrooms). Allow Alex to wear them proactively rather than reactively.',
    frequency: 'As needed for loud environments',
    rationale: 'Auditory sensitivity is a noted sensory avoidance for Alex. Proactive sensory support prevents dysregulation before it starts, preserving cognitive capacity for social learning.',
  },
])

const alexAccommodations = JSON.stringify([
  'Provide 5-minute advance warning before all activity transitions',
  'Allow noise-canceling headphones in hallways, lunch, and assemblies',
  'Offer choice of seating away from high-traffic noise areas',
  'Use visual schedule posted at desk showing the full school day',
  'Accept non-verbal greetings (wave, thumbs up) as valid social initiations',
  'Allow interest-based reward system (Minecraft sticker chart) for social milestones',
])

const alexMaterials = JSON.stringify([
  'Time Timer (visual countdown timer) — classroom and home versions',
  'Dinosaur-themed Social Stories booklet (educator-created)',
  'Zones of Regulation visual chart and daily check-in sheet',
  'Minecraft-themed card game or custom turn-taking cards',
  'Feelings chart with dinosaur emoji characters',
  'Noise-canceling headphones (classroom set)',
])

const alexWeeklyStructure = JSON.stringify({
  monday: 'Social story reading + feelings check-in morning routine',
  tuesday: 'Minecraft turn-taking game session (1:1 with educator)',
  wednesday: 'Peer turn-taking practice with one familiar friend',
  thursday: 'Video modeling of greetings + role-play practice',
  friday: 'Generalization activity — real-world greeting practice + weekly celebration',
  notes: 'Sensory break available daily after lunch. Transition warnings every day.',
})

const alexAssessments = JSON.stringify([
  'Daily behavior log tracking greeting initiations (tally marks per opportunity)',
  'Weekly turn-taking session data (number of consecutive exchanges)',
  'Zones check-in data logged in communication notebook',
  'Monthly social story comprehension check (3 comprehension questions)',
])

// ---------- Plan data for Maya (Communication) ----------

const mayaGoals = JSON.stringify([
  {
    id: 'g1',
    description: 'Use AAC device, PECS cards, or gesture to make a request for a preferred item or activity in 4 out of 5 daily opportunities without physical prompt',
    measurementCriteria: '4/5 independent requests per day, logged in AAC data sheet',
    timeframe: '6-8 weeks',
    rationale: 'Maya is a kinesthetic learner who excels in creative expression. PECS and AAC give a physical, tangible communication method that complements her strengths and supports her minimal verbal communication style.',
  },
  {
    id: 'g2',
    description: 'Express a current emotion (happy, frustrated, tired, excited) through art, gesture, or symbol board with 70% accuracy across 2 consecutive weeks',
    measurementCriteria: '70% correct emotional communications over 2 consecutive weeks',
    timeframe: '8-10 weeks',
    rationale: 'Maya has strong creative expression as a noted strength. Art-based emotional communication channels this strength while building functional communication — the emotion journal becomes both a communication tool and creative outlet.',
  },
  {
    id: 'g3',
    description: 'Consistently respond to own name by orienting gaze within 3 seconds in 5 out of 5 trials across 3 consecutive sessions',
    measurementCriteria: '5/5 responses within 3 seconds, 3 consecutive sessions',
    timeframe: '3-4 weeks',
    rationale: 'Name response is a foundational social communication skill. Music-based name-calling (singing Maya\'s name in a preferred tune) leverages her music interest to make practice motivating and memorable.',
  },
])

const mayaStrategies = JSON.stringify([
  {
    id: 's1',
    title: 'PECS + Animal Theme Communication Book',
    description: 'Create a PECS communication book with animal-themed photo cards of preferred items, activities, and emotions. Practice "I want [animal card]" exchange phase daily, gradually expanding vocabulary.',
    frequency: 'Multiple opportunities throughout the day',
    rationale: 'PECS is evidence-based for minimal verbal communicators. Animal themes connect to Maya\'s interest, making the communication book personally meaningful and increasing motivation to use it.',
  },
  {
    id: 's2',
    title: 'Art-Based Emotion Journal',
    description: 'Provide a daily "Feelings Art Journal" — Maya draws or paints how she feels at start and end of day. Educator models labelling the artwork ("Your picture looks excited — big bright colours!"). Over time, introduce feeling word labels alongside drawings.',
    frequency: 'Daily (morning and end of day)',
    rationale: 'Art is Maya\'s primary strength and medium of expression. This strategy meets Maya where she is, building communication skills through a highly preferred activity rather than forcing a verbal or symbol-only approach.',
  },
  {
    id: 's3',
    title: 'Music-Supported Routines',
    description: 'Use consistent songs to signal routine transitions (arrival song, clean-up song, dismissal song). When calling Maya\'s name for attention, embed it in a familiar short melody. This reduces the surprise of unexpected verbal demands.',
    frequency: 'All daily routines',
    rationale: 'Music is highly motivating for Maya and provides predictable auditory cues. Embedding communication in music makes demands feel less abrupt and leverages the sensory experience Maya seeks.',
  },
  {
    id: 's4',
    title: 'Choice Boards with Animal Photos',
    description: 'Provide visual choice boards at key decision points (snack, activity, work area). Use real photos of items alongside animal characters Maya recognizes. Limit choices to 2-3 to reduce cognitive load.',
    frequency: 'At every choice opportunity',
    rationale: 'Choice boards reduce communication demands while building agency and participation. Animal-themed visuals increase engagement and make the board feel personal to Maya.',
  },
])

const mayaAccommodations = JSON.stringify([
  'Always pair verbal instructions with visual or gesture cues',
  'Allow art materials as a communication and self-regulation tool',
  'Avoid unexpected physical touch — announce proximity before approaching',
  'Provide movement breaks every 45-60 minutes',
  'Use music transitions instead of verbal-only announcements',
  'Seat away from crowded areas; offer quiet workspace when needed',
])

const mayaMaterials = JSON.stringify([
  'PECS communication binder with animal-themed cards',
  'Feelings art journal and art supplies (kept at desk)',
  'Transition songs playlist (educator-curated)',
  'Animal-themed choice boards for key decision points',
  'AAC app on shared tablet (if available)',
])

const mayaWeeklyStructure = JSON.stringify({
  monday: 'PECS request practice + introduce new vocabulary card',
  tuesday: 'Art journal morning + music-based routine practice',
  wednesday: 'Name response drills woven into preferred activity (drawing animals)',
  thursday: 'Choice board expansion — add one new option',
  friday: 'Free art session + weekly communication data review',
  notes: 'Movement break every 45 minutes. Reduce auditory demands during meltdown-risk periods.',
})

const mayaAssessments = JSON.stringify([
  'Daily AAC/PECS data sheet — number of independent requests',
  'Weekly art journal review for emotional communication range',
  'Name response probe — 5-trial data 3x per week',
])

// ---------- Plan data for Jordan (Life Skills) ----------

const jordanGoals = JSON.stringify([
  {
    id: 'g1',
    description: 'Independently complete a 5-step morning preparation routine using a visual or digital checklist with no adult prompting across 4 consecutive school days',
    measurementCriteria: '5/5 steps completed independently, 4 consecutive days',
    timeframe: '4-6 weeks',
    rationale: 'Jordan is a self-directed, logical thinker who responds well to structured systems. A digital checklist framed as a "mission objective" or "system initialization sequence" aligns with Jordan\'s coding interest and makes routine compliance feel purposeful.',
  },
  {
    id: 'g2',
    description: 'Use a digital calendar or planner to record and complete at least 3 assigned tasks per week with no missed deadlines over a 4-week period',
    measurementCriteria: '3+ tasks recorded and completed per week, 4 consecutive weeks',
    timeframe: '6-8 weeks',
    rationale: 'Executive function challenges around planning and task initiation are common. Jordan\'s coding background means digital tools and structured systems are familiar and motivating — using productivity apps frames organization as a skill, not a burden.',
  },
  {
    id: 'g3',
    description: 'Identify and apply one social navigation strategy (pause-and-observe, scripted opener) in an unstructured social situation 3 out of 5 observed opportunities per week',
    measurementCriteria: '3/5 observed unstructured social situations per week',
    timeframe: '8-10 weeks',
    rationale: 'Jordan reads well and learns efficiently through structured analysis. Chess metaphors ("reading the board before making a move") provide a logical framework for social observation that feels natural rather than forced.',
  },
  {
    id: 'g4',
    description: 'Self-advocate for a needed accommodation or support in at least 1 structured situation per week using pre-practiced language',
    measurementCriteria: '1 self-advocacy instance per week across 6 consecutive weeks',
    timeframe: '8-10 weeks',
    rationale: 'As Jordan approaches adulthood, self-advocacy is a critical life skill. Practicing scripted advocacy statements (framed as "debugging communication") builds confidence and prepares Jordan for higher education and employment contexts.',
  },
])

const jordanStrategies = JSON.stringify([
  {
    id: 's1',
    title: 'Coding-Inspired Task Breakdown',
    description: 'Break complex tasks into sequential "pseudocode" steps with Jordan. For any multi-step activity (e.g., project planning, morning routine), write it as a numbered algorithm. Jordan reviews and "runs" the checklist independently.',
    frequency: 'For all new multi-step tasks',
    rationale: 'Jordan\'s coding expertise means algorithmic thinking is a genuine strength. Translating task analysis into familiar pseudocode notation makes executive function scaffolding feel intellectually engaging rather than remedial.',
  },
  {
    id: 's2',
    title: 'Chess-Framework for Social Observation',
    description: 'Use chess metaphors to teach social reading: "Before making a move, observe the board — watch how others are positioned, what expressions they have, what the current \'game state\' is." Practice through role-play scenarios and video review.',
    frequency: '2x per week, 20-minute social coaching sessions',
    rationale: 'Chess is a deep interest for Jordan and involves strategic pattern recognition — the same cognitive processes needed for social observation. This reframe makes social skills practice feel like mastering a game, not remediating a deficit.',
  },
  {
    id: 's3',
    title: 'Digital Productivity System',
    description: 'Support Jordan in setting up a productivity app (Notion, Google Calendar, or similar) as a personal task and deadline tracker. Weekly 10-minute "system review" session to check upcoming tasks and plan the week.',
    frequency: 'Daily app check-in + weekly review',
    rationale: 'Digital tools fit Jordan\'s reading/writing learning style and interest in systems. A self-managed digital system builds executive function skills while supporting autonomy and preparing for post-secondary life.',
  },
  {
    id: 's4',
    title: 'Space/Logic Themed Social Scripts',
    description: 'Co-create conversation scripts using space exploration metaphors (e.g., "initiating contact" = "opening a communication channel"). Practice scripted openers and exit phrases in role-play before real-world situations.',
    frequency: '2x per week role-play, plus real-world practice as opportunities arise',
    rationale: 'Space exploration is a top interest for Jordan. Framing social scripts as mission protocols reduces anxiety by making interactions feel familiar and structured, with clear "mission parameters."',
  },
])

const jordanAccommodations = JSON.stringify([
  'Provide written or typed instructions alongside verbal directions',
  'Allow noise-reducing earbuds or headphones in open or loud spaces',
  'Offer structured pre-planning time (5 minutes) before unstructured periods',
  'Accept typed responses as equivalent to verbal participation',
  'Provide advance notice of schedule changes in written format',
  'Allow fidget tool at desk (cube, ring) — non-disruptive sensory support',
])

const jordanMaterials = JSON.stringify([
  'Digital calendar or task management app (Notion / Google Calendar)',
  'Personal visual schedule template (coded like a daily sprint)',
  'Chess set for social-framing practice sessions',
  'Coding notebook for pseudocode task breakdowns',
  'Social script cards with space-exploration themes',
])

const jordanWeeklyStructure = JSON.stringify({
  monday: 'Weekly digital planner setup + task prioritisation session',
  tuesday: 'Coding-style task breakdown for assigned projects',
  wednesday: 'Social coaching session — chess-framework role-play',
  thursday: 'Self-advocacy practice — scripted conversation lab',
  friday: 'System review + executive function debrief + celebrate wins',
  notes: 'Jordan works best with structured downtime between high-demand tasks. Provide 5-min transition buffer.',
})

const jordanAssessments = JSON.stringify([
  'Weekly checklist completion rate (percentage of tasks completed independently)',
  'Digital planner adherence log — missed deadlines tracked and reviewed together',
  'Social coaching session notes — strategy application observations',
  'Monthly self-advocacy log — number of supported and independent instances',
])

// ---------- Schedule blocks ----------

const alexBlocks = JSON.stringify([
  { id: 'b1', startTime: '08:30', endTime: '09:00', activity: 'Arrival & Morning Routine', iconKey: 'arrival', color: '#8B5CF6', order: 0, transitionCue: 'Ring a soft bell 2 minutes before' },
  { id: 'b2', startTime: '09:00', endTime: '09:15', activity: 'Feelings Check-in + Zones', iconKey: 'circle', color: '#10B981', order: 1 },
  { id: 'b3', startTime: '09:15', endTime: '10:00', activity: 'Reading (Dinosaur books)', iconKey: 'book', color: '#3B82F6', order: 2 },
  { id: 'b4', startTime: '10:00', endTime: '10:45', activity: 'Math (Pattern activities)', iconKey: 'math', color: '#F59E0B', order: 3 },
  { id: 'b5', startTime: '10:45', endTime: '11:00', activity: 'Sensory Break', iconKey: 'break', color: '#84CC16', order: 4 },
  { id: 'b6', startTime: '11:00', endTime: '11:45', activity: 'Social Skills Activity', iconKey: 'circle', color: '#EC4899', order: 5, notes: 'Minecraft turn-taking game today' },
  { id: 'b7', startTime: '11:45', endTime: '12:30', activity: 'Lunch', iconKey: 'lunch', color: '#06B6D4', order: 6, transitionCue: 'Headphones available in lunchroom' },
  { id: 'b8', startTime: '12:30', endTime: '13:00', activity: 'Dismissal Prep', iconKey: 'dismissal', color: '#8B5CF6', order: 7 },
])

const mayaBlocks = JSON.stringify([
  { id: 'b1', startTime: '08:45', endTime: '09:00', activity: 'Arrival Song & Routine', iconKey: 'arrival', color: '#8B5CF6', order: 0 },
  { id: 'b2', startTime: '09:00', endTime: '09:20', activity: 'Feelings Art Journal', iconKey: 'art', color: '#EC4899', order: 1 },
  { id: 'b3', startTime: '09:20', endTime: '10:00', activity: 'PECS Communication Practice', iconKey: 'circle', color: '#10B981', order: 2 },
  { id: 'b4', startTime: '10:00', endTime: '10:45', activity: 'Art / Drawing (Animals)', iconKey: 'art', color: '#F59E0B', order: 3 },
  { id: 'b5', startTime: '10:45', endTime: '11:00', activity: 'Movement Break', iconKey: 'pe', color: '#84CC16', order: 4 },
  { id: 'b6', startTime: '11:00', endTime: '11:30', activity: 'Music Circle Time', iconKey: 'music', color: '#3B82F6', order: 5 },
  { id: 'b7', startTime: '11:30', endTime: '12:15', activity: 'Lunch', iconKey: 'lunch', color: '#06B6D4', order: 6 },
  { id: 'b8', startTime: '12:15', endTime: '12:45', activity: 'Snack + Free Choice Art', iconKey: 'snack', color: '#EF4444', order: 7 },
  { id: 'b9', startTime: '12:45', endTime: '13:00', activity: 'Dismissal Song', iconKey: 'dismissal', color: '#8B5CF6', order: 8 },
])

const jordanBlocks = JSON.stringify([
  { id: 'b1', startTime: '08:30', endTime: '08:45', activity: 'Arrival + Daily Planner Review', iconKey: 'arrival', color: '#8B5CF6', order: 0 },
  { id: 'b2', startTime: '08:45', endTime: '09:30', activity: 'Reading / Independent Study', iconKey: 'book', color: '#3B82F6', order: 1 },
  { id: 'b3', startTime: '09:30', endTime: '10:15', activity: 'Coding / Computer Lab', iconKey: 'computer', color: '#10B981', order: 2 },
  { id: 'b4', startTime: '10:15', endTime: '10:30', activity: 'Break + Fidget Tool', iconKey: 'break', color: '#84CC16', order: 3 },
  { id: 'b5', startTime: '10:30', endTime: '11:15', activity: 'Math (Logic / Chess puzzles)', iconKey: 'math', color: '#F59E0B', order: 4 },
  { id: 'b6', startTime: '11:15', endTime: '12:00', activity: 'Social Coaching Session', iconKey: 'therapy', color: '#EC4899', order: 5, notes: 'Chess-framework social role-play' },
  { id: 'b7', startTime: '12:00', endTime: '12:45', activity: 'Lunch (quiet area available)', iconKey: 'lunch', color: '#06B6D4', order: 6 },
  { id: 'b8', startTime: '12:45', endTime: '13:00', activity: 'Weekly Review + Dismissal', iconKey: 'dismissal', color: '#8B5CF6', order: 7 },
])

// ---------- Seed ----------

async function main() {
  console.log('🌱 Seeding demo data...')

  // Clean up existing demo user
  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } })

  // Create demo user
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: 'Sarah Mitchell',
      passwordHash,
      role: 'TEACHER',
    },
  })
  console.log('✅ Demo user created:', user.email)

  // ---- Child 1: Alex ----
  const alex = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Alex',
      dateOfBirth: new Date('2019-03-15'),
      ageGroup: 'EARLY_CHILDHOOD_5_7',
      supportLevel: 'LEVEL_1',
      communicationStyle: 'VERBAL',
      learningStyle: 'VISUAL',
      strengths: JSON.stringify(['excellent memory', 'pattern recognition', 'attention to detail', 'logical sequencing']),
      challenges: JSON.stringify(['transitions between activities', 'loud environments', 'unstructured group settings']),
      sensoryPreferences: JSON.stringify({ avoids: ['loud sudden noises', 'bright overhead lights'], seeks: ['deep pressure', 'predictable routines', 'weighted blanket'] }),
      interests: JSON.stringify(['dinosaurs', 'trains', 'Minecraft', 'building blocks']),
      notes: 'Alex thrives with visual schedules and advance warnings before transitions. Responds very well to special-interest-based reward systems.',
    },
  })

  const alexPlan = await prisma.learningPlan.create({
    data: {
      childId: alex.id,
      title: 'Social Communication & Emotional Regulation Plan',
      focusArea: 'Social Skills',
      goals: alexGoals,
      strategies: alexStrategies,
      accommodations: alexAccommodations,
      materials: alexMaterials,
      weeklyStructure: alexWeeklyStructure,
      assessmentMethods: alexAssessments,
      rawResponse: '{"seeded":true}',
      promptUsed: 'Demo seed data',
      modelVersion: 'claude-sonnet-4-6',
    },
  })

  await prisma.schedule.create({
    data: {
      childId: alex.id,
      title: 'Monday Visual Schedule',
      dayOfWeek: 'MONDAY',
      blocks: alexBlocks,
    },
  })

  // Alex progress entries — 8 entries over 4 weeks
  const alexProgressData = [
    { goalDescription: 'Greeting initiation with familiar adult', rating: 2, notes: 'Required 2 verbal prompts. Used dinosaur social story before session.', daysAgo: 28 },
    { goalDescription: 'Greeting initiation with familiar adult', rating: 3, notes: 'One prompt needed. Made eye contact and said "hi". Progress!', daysAgo: 21 },
    { goalDescription: 'Turn-taking (Minecraft card game)', rating: 2, notes: 'Struggled with waiting. Needed physical prompt twice.', daysAgo: 21 },
    { goalDescription: 'Greeting initiation with familiar adult', rating: 4, notes: 'Independent greeting to 3 of 5 peers. Unprompted wave to teacher.', daysAgo: 14 },
    { goalDescription: 'Turn-taking (Minecraft card game)', rating: 3, notes: 'Completed 4 consecutive exchanges with peer. Good progress.', daysAgo: 14 },
    { goalDescription: 'Zones check-in accuracy', rating: 4, notes: 'Correctly identified emotions 4/5 times. Named "yellow zone" independently.', daysAgo: 7 },
    { goalDescription: 'Greeting initiation with familiar adult', rating: 5, notes: 'Independent greetings to 4/5 people without prompting. Milestone!', daysAgo: 5 },
    { goalDescription: 'Turn-taking (Minecraft card game)', rating: 5, notes: '7 consecutive exchanges with peer. No prompts needed. Celebrated with sticker chart!', daysAgo: 2 },
  ]

  for (const entry of alexProgressData) {
    const date = new Date()
    date.setDate(date.getDate() - entry.daysAgo)
    await prisma.progressEntry.create({
      data: {
        childId: alex.id,
        planId: alexPlan.id,
        goalDescription: entry.goalDescription,
        rating: entry.rating,
        notes: entry.notes,
        date,
      },
    })
  }
  console.log('✅ Alex created with plan, schedule, and 8 progress entries')

  // ---- Child 2: Maya ----
  const maya = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Maya',
      dateOfBirth: new Date('2014-07-22'),
      ageGroup: 'EARLY_ADOLESCENCE_11_13',
      supportLevel: 'LEVEL_2',
      communicationStyle: 'MINIMAL_VERBAL',
      learningStyle: 'KINESTHETIC',
      strengths: JSON.stringify(['creative expression through art', 'empathy and emotional awareness', 'visual-spatial thinking', 'music responsiveness']),
      challenges: JSON.stringify(['verbal communication in groups', 'unexpected physical touch', 'crowded or loud environments', 'written output tasks']),
      sensoryPreferences: JSON.stringify({ avoids: ['unexpected physical touch', 'crowded spaces', 'unpredictable loud sounds'], seeks: ['art materials and textures', 'movement breaks', 'music and rhythm', 'animal interaction'] }),
      interests: JSON.stringify(['drawing and painting', 'animals', 'music and singing', 'nature walks']),
      notes: 'Maya communicates most effectively through art and gesture. PECS system introduced at age 9. Responds very well to music-based transitions. Animals are a powerful motivator.',
    },
  })

  const mayaPlan = await prisma.learningPlan.create({
    data: {
      childId: maya.id,
      title: 'Functional Communication & Expressive Language Plan',
      focusArea: 'Communication',
      goals: mayaGoals,
      strategies: mayaStrategies,
      accommodations: mayaAccommodations,
      materials: mayaMaterials,
      weeklyStructure: mayaWeeklyStructure,
      assessmentMethods: mayaAssessments,
      rawResponse: '{"seeded":true}',
      promptUsed: 'Demo seed data',
      modelVersion: 'claude-sonnet-4-6',
    },
  })

  await prisma.schedule.create({
    data: {
      childId: maya.id,
      title: 'Tuesday Visual Schedule',
      dayOfWeek: 'TUESDAY',
      blocks: mayaBlocks,
    },
  })

  const mayaProgressData = [
    { goalDescription: 'PECS request — preferred item', rating: 2, notes: 'Used PECS card for "art" after 2 physical prompts. Learning Phase 2.', daysAgo: 25 },
    { goalDescription: 'Name response within 3 seconds', rating: 2, notes: '3/5 responses. Works better with song-embedded name call.', daysAgo: 25 },
    { goalDescription: 'PECS request — preferred item', rating: 3, notes: 'Spontaneously handed "music" card to request song. First unprompted request!', daysAgo: 18 },
    { goalDescription: 'Emotional expression through art journal', rating: 3, notes: 'Drew angry/frustrated colours in morning journal. Teacher labelled it together.', daysAgo: 18 },
    { goalDescription: 'Name response within 3 seconds', rating: 4, notes: '4/5 responses with music-embedded name call. Much stronger.', daysAgo: 10 },
    { goalDescription: 'PECS request — preferred item', rating: 4, notes: '4 independent PECS requests today — animals, art, music, snack. Excellent!', daysAgo: 4 },
  ]

  for (const entry of mayaProgressData) {
    const date = new Date()
    date.setDate(date.getDate() - entry.daysAgo)
    await prisma.progressEntry.create({
      data: {
        childId: maya.id,
        planId: mayaPlan.id,
        goalDescription: entry.goalDescription,
        rating: entry.rating,
        notes: entry.notes,
        date,
      },
    })
  }
  console.log('✅ Maya created with plan, schedule, and 6 progress entries')

  // ---- Child 3: Jordan ----
  const jordan = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Jordan',
      dateOfBirth: new Date('2011-01-08'),
      ageGroup: 'ADOLESCENCE_14_18',
      supportLevel: 'LEVEL_1',
      communicationStyle: 'VERBAL',
      learningStyle: 'READING_WRITING',
      strengths: JSON.stringify(['logical and analytical thinking', 'self-directed learning', 'exceptional focus on topics of interest', 'digital literacy and coding skills']),
      challenges: JSON.stringify(['reading implicit social cues', 'executive function and task initiation', 'unstructured free time', 'transitioning from preferred to non-preferred tasks']),
      sensoryPreferences: JSON.stringify({ avoids: ['crowded or noisy spaces', 'background conversation noise', 'unexpected physical contact'], seeks: ['structured and orderly environments', 'fidget tools at desk', 'dim or natural lighting'] }),
      interests: JSON.stringify(['coding and programming', 'space exploration and astronomy', 'chess', 'strategy games', 'science fiction']),
      notes: 'Jordan is highly capable and self-motivated in structured contexts. Framing tasks as systems or algorithms is highly effective. Chess and space metaphors work well for social skills instruction. Strong written communication.',
    },
  })

  const jordanPlan = await prisma.learningPlan.create({
    data: {
      childId: jordan.id,
      title: 'Executive Function & Life Skills Independence Plan',
      focusArea: 'Life Skills',
      goals: jordanGoals,
      strategies: jordanStrategies,
      accommodations: jordanAccommodations,
      materials: jordanMaterials,
      weeklyStructure: jordanWeeklyStructure,
      assessmentMethods: jordanAssessments,
      rawResponse: '{"seeded":true}',
      promptUsed: 'Demo seed data',
      modelVersion: 'claude-sonnet-4-6',
    },
  })

  await prisma.schedule.create({
    data: {
      childId: jordan.id,
      title: 'Wednesday Daily Structure',
      dayOfWeek: 'WEDNESDAY',
      blocks: jordanBlocks,
    },
  })

  const jordanProgressData = [
    { goalDescription: 'Morning routine checklist (5-step)', rating: 2, notes: 'Completed 3/5 steps independently. Needed prompting for steps 4 and 5.', daysAgo: 26 },
    { goalDescription: 'Digital planner usage', rating: 3, notes: 'Added 2 of 3 assigned tasks to planner. Completed both on time.', daysAgo: 22 },
    { goalDescription: 'Morning routine checklist (5-step)', rating: 3, notes: '4/5 steps independently. Only needed 1 prompt for final step.', daysAgo: 15 },
    { goalDescription: 'Social navigation — chess framework', rating: 3, notes: 'Used "observe the board" strategy before joining lunch table. Sat successfully with 2 peers.', daysAgo: 12 },
    { goalDescription: 'Digital planner usage', rating: 4, notes: 'All 3 tasks in planner. Completed all before deadlines. No reminders needed!', daysAgo: 6 },
  ]

  for (const entry of jordanProgressData) {
    const date = new Date()
    date.setDate(date.getDate() - entry.daysAgo)
    await prisma.progressEntry.create({
      data: {
        childId: jordan.id,
        planId: jordanPlan.id,
        goalDescription: entry.goalDescription,
        rating: entry.rating,
        notes: entry.notes,
        date,
      },
    })
  }
  console.log('✅ Jordan created with plan, schedule, and 5 progress entries')

  console.log('')
  console.log('🎉 Seed complete!')
  console.log('   Demo login: demo@lumio.app / demo1234')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
