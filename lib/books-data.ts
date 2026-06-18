export interface Chapter {
  number: number
  title: string
  paragraphs: string[]
}

export interface Book {
  slug: string
  title: string
  subtitle: string
  author: string
  genre: string[]
  synopsis: string
  accentColor: string
  coverFrom: string   // Tailwind gradient origin class
  coverUrl?: string   // Notion page cover / file property image URL
  bgVideoId: string   // YouTube video ID — update with actual DYFF channel video IDs
  status: 'complete' | 'ongoing'
  chapterCount: number
  year: number
  chapters: Chapter[]
}

// ─── LEGEND OF LEVITICUS ───────────────────────────────────────────────────

const leviticusChapters: Chapter[] = [
  {
    number: 1,
    title: 'The Ink That Burns',
    paragraphs: [
      'The map on his skin appeared the night his father died.',
      'Leviticus Okafor woke at three-seventeen in the morning to the sound of absolute silence — the kind that does not arrive naturally in Lagos but is instead left behind when something enormous has been taken from a room. The generators on their street had cut at midnight as usual, and through the window the pre-dawn air came in slow and diesel-thick. He lay on his back staring at the cracked ceiling, feeling the wrongness of it the way you feel a tooth before you feel the pain.',
      'Then he noticed the heat.',
      'It started at his left shoulder blade. A slow spiral, deliberate as calligraphy — not fire, nothing so obvious as fire, but the deeply specific warmth of something alive and tracing, moving from his shoulder across his chest and down his left side with the patience of someone who knows the work is important and refuses to rush. Like ink drying in warm sun. Like a second pulse, slower and older than his own.',
      'He pulled his shirt over his head.',
      'In the grey-blue glow of his phone screen, the lines were already there. Fine and precise and permanent as bone — they moved across his shoulder, branching and converging in a pattern that suggested routes without being roads, rivers without being water, a network of passages through somewhere he had never been but somehow almost recognised. The way you know the face of a parent in a photograph taken before you existed.',
      'He pressed his fingertips against the marks. They did not smear. They did not fade.',
      'Outside, the street was beginning its daily resurrection: a motorcycle three compounds away, a woman\'s voice raised in an argument she had clearly paused for sleep and was now resuming, the generators of Alaba Market coughing back to life in sequence. Normal Lagos morning sounds in a week that had stopped being normal the moment his father closed his eyes and did not open them again.',
      'There was a shape near his collarbone — three lines converging at a single point — and something about its geometry suggested a threshold, a door standing open. He pressed the pad of his thumb against it. One instant, white-hot and total: a courtyard, dry earth under bare feet, walls of old stone gone black with something older than paint, and cut into the lintel of an iron door, in the exact same three-line convergence, a symbol carved deep and waiting.',
      'Then he was back. His room. His phone. His father\'s slippers still by the front door.',
      'He dressed slowly, layering carefully until the marks were covered. He did not call anyone. He was nineteen years old with twenty-three thousand naira to his name, no university admission, no plan, and a map he had never asked for burning itself into the left side of his body in the hours after his father\'s death. He stood in the kitchen for a long time looking at his father\'s phone on the table.',
      'He did not know yet that the map was also a key. He did not know that in three different cities, phones were already ringing, names being said in quiet voices by people who had spent years waiting for this particular signal. He only knew the heat had not stopped. It had settled into him like a second heartbeat — patient and certain and pointed, like a compass that has finally found north.',
      'He opened the front door and stepped into the Lagos morning. The day after his father died, Leviticus had decided he was done waiting. The map, it seemed, had decided the same.',
    ],
  },
  {
    number: 2,
    title: 'The First Gate',
    paragraphs: [
      'The map led him to Apapa Port. This was not the obvious conclusion.',
      'Leviticus had lived in Lagos his whole life and been to Apapa exactly twice, both times because his father had business there that was never fully explained. Standing at the edge of the container yard in noon heat, the smell of fuel oil and salt water pressed flat and inescapable, he was still not entirely sure what he was doing here — only that whenever he moved in a direction that aligned with the map\'s internal logic, the heat in his skin intensified in a way that was almost pleasant. A hum, deeper than touch. When he moved against it, the heat went cold and wrong.',
      'He had followed the heat to a bus. The bus to Apapa. A tro-tro to the port gate. His feet to a gap in the fence where the rust had eaten an opening exactly wide enough to walk through sideways.',
      'He moved between the containers, following the warmth. It pulled him to the eastern edge of the yard, where the oldest containers — paint entirely surrendered to rust — were stacked three high against the fence. Between two of them, positioned with a deliberateness that was only visible if you were looking for it, a corrugated iron door stood flush against the gap. Above it, hammered into the metal in someone\'s careful hand, was the same three-line convergence from his collarbone.',
      'Sitting on a plastic chair beside the door, eating noodles with the unhurried calm of someone who has been waiting a very long time, was a woman he had never seen before. She was perhaps in her mid-forties, dressed as if she had not yet decided between a board meeting and a burial, and she looked up at him with no particular surprise.',
      '"You look like him," she said.',
      '"Who?"',
      '"Your father. Before he chose wrong."',
      'The air around the door changed. It dropped in pressure rather than temperature — the specific quality of air inside a held breath. Leviticus felt the map on his skin pulse once, hard, like a second heartbeat saying: *here*.',
      '"My name is Adaeze," she said, rising. She was taller than she had looked sitting. "I was supposed to teach you twenty years ago. I didn\'t expect these circumstances." She looked at him steadily. "The map appeared on your father when he was your age. He reached the first gate and walked away. Went home. Said it wasn\'t worth it."',
      '"And the map waited," Leviticus said.',
      '"Twenty years." A pause that was not quite sympathy. "You\'re what it was waiting for."',
      'He looked at the door. He looked at the symbol above it. He thought about his father — about the slippers by the door, the phone on the table, the twenty years of never explaining. A man who had stood in front of something enormous and chosen the ordinary life. Who had raised a son in the shadow of a decision he never discussed.',
      '"What\'s behind it?" Leviticus asked.',
      '"A corridor," Adaeze said. "And a test. Pass it, the next section of your map activates."',
      '"And if I don\'t go?"',
      'She met his eyes. "Then the map waits," she said quietly, "for whoever comes after you."',
      'Leviticus pressed two fingers against the mark on his collarbone. The warmth was steady, patient, enormous — the calm certainty of something designed before he was born that would still be there after he was gone. He thought about his father turning away from this exact door. He thought about the courtyard and the iron threshold and the air that tasted like lightning.',
      '"Tell me about the test," he said.',
      'Adaeze almost smiled. "Now you sound like him," she said. "When he still had nerve."',
    ],
  },
  {
    number: 3,
    title: 'Blood on the Map',
    paragraphs: [
      'The corridor behind the first gate lasted thirty seconds and contained thirty years.',
      'It was not walking exactly — it was more like being moved, like being a thought crossing a mind that belonged entirely to the map, the walls pressing close with their darkness and their patience. And then, without transition, he was inside a room with no visible light source that was nevertheless completely lit, sitting across a low stone table from a man he recognised from a single photograph his mother kept: his grandfather, who had been dead for fifteen years.',
      'The man who was not quite his grandfather spoke first. "Sit."',
      'Leviticus was already sitting.',
      '"You have questions."',
      '"You\'re a Guardian," Leviticus said.',
      '"I was given this form because it would be legible to you." A slight pause. "Less frightening than the alternative."',
      'On the table between them: a piece of cloth, very old, dark-stained at the centre. Folded inside it, a knife about the length of his hand, the blade the colour of sky with no stars in it.',
      '"The map has seven sections," the Guardian said. "You have activated three. To open the fourth, you offer a blood token — three drops from the palm of your giving hand, freely given." He placed one finger flat on the cloth. "In exchange, the fourth section reveals the location of something your father hid before he turned back. Something he took from the map\'s final destination."',
      '"Took," Leviticus repeated. "He stole it."',
      '"He was afraid of what someone would ask him to give up in order to use it." The Guardian\'s eyes — almost human — held his. "He didn\'t hide it to protect it. He hid it because he wanted to keep it and wanted no one to ask him about the cost."',
      'The room was very quiet. Leviticus thought about his father — about the ordinary life, the unexplained business in Apapa, the slippers, the phone. A man who had stood at exactly this table and looked at exactly this knife and chosen the ordinary life. Who had spent twenty years living in the shadow of a thing he kept but would not use.',
      'He picked up the knife. It was lighter than it looked. The balance was different from any knife he had held — purposeful, waiting, made for exactly this and for nothing else.',
      'He held his left palm flat over the cloth.',
      'The cut was fast and the pain was clean. Three drops fell — three distinct circles on the ancient fabric — and then the map ignited.',
      'All at once: every line from shoulder to hip, simultaneously alive with light, with heat, with a clarity so total that for one panicked moment he thought he was burning from the inside. Then it settled, like a breath released at last after too long held, and he could feel the new section with the same certainty he could feel his own ribcage. A location. A building. A room inside the building. Something in the room that had been patient for twenty years and was now, for the first time, pointing at him.',
      '"The first gate is passed," the Guardian said.',
      'When Leviticus looked up, the room was gone. He stood at the gap in the fence in the Apapa container yard. The sun continued its vendetta. Adaeze stood beside him, her expression level and unreadable.',
      '"Six more," she said.',
      'Leviticus closed his hand around the cut and felt the heat of the new path in his skin — pointing north-northwest, precise as a compass, sure as a name.',
      '"Okay," he said. He didn\'t sound afraid. He was, a little — but he didn\'t sound it. That was probably the point.',
    ],
  },
]

// ─── ESE ────────────────────────────────────────────────────────────────────

const eseChapters: Chapter[] = [
  {
    number: 1,
    title: 'Letters in the Rain',
    paragraphs: [
      'The bookshop had no right to still be open at ten-thirty at night in a rainstorm.',
      'Ese had been walking for twenty minutes with a broken umbrella, which is the precise kind of detail that follows immediately from the decision to take a shortcut. The rain was the serious Lagos variety — not the aggressive hammering of rainy season but the cold, quiet, persistent rain of the transition period, the kind that doesn\'t announce itself and simply gets into everything. Her laptop bag was supposedly waterproof. She had very little faith left in this claim.',
      'The light through the bookshop window was warm and specific, the yellow of proper bulbs rather than the blue-white of generators. Someone was taking care of this light. She pushed the door.',
      'A bell above the door. Wooden floors. That particular smell of old paper and dust that belongs to no other category of human experience. Shelves floor-to-ceiling with no organizational logic she could immediately determine. And behind the counter at the back, a man looking up from whatever he was reading with the expression of someone who was not expecting company and was not yet certain whether to be pleased about it.',
      '"We\'re closing soon," he said.',
      '"It\'s raining," said Ese.',
      'He looked at her. He looked at the rain outside the window. He appeared to weigh these two facts carefully and reach a fair conclusion. "Fifteen minutes," he said, and went back to his book.',
      'She walked the shelves. The collection had the quality of personal obsession rather than market curation — African fiction alongside European literary theory alongside a full shelf of manga alongside cookbooks from the nineteen-seventies. Near the back she found a short story collection she had been looking for, on and off, for two years.',
      'She held it for a while without moving.',
      '"You write," he said. He had not looked up.',
      '"How would you know that," she said.',
      '"The way you hold books. Writers hold books the way other people hold things they made themselves."',
      '"That\'s presumptuous," she said.',
      '"Yes," he agreed. "Am I wrong?"',
      'She had published one short story collection, which had sold modestly and been reviewed generously by people who wrote for publications she respected. She was three years into a novel that had begun to feel less like a work in progress and more like a long negotiation with a subject that kept changing its terms. She did not usually tell this to strangers.',
      '"No," she said.',
      'He looked up then. His eyes were the dark attentive kind — trained by reading to miss nothing, to find meaning in what is adjacent rather than stated. "Malik," he said.',
      '"Ese."',
      '"What are you working on?"',
      '"A novel. About a woman who writes letters she never sends."',
      'He considered this the way he\'d considered the rain. "Why doesn\'t she send them?"',
      '"Because she\'s more honest when she believes no one is reading."',
      'The rain against the window was the only sound. Ese became aware that she was still holding the short story collection and that her bag was dripping on his floor and that the fifteen minutes had almost certainly passed.',
      '"I\'ll buy this," she said.',
      '"It\'s a good one," he said. "I have a signed first edition in the back if you want to see it."',
      '"You\'re keeping it."',
      '"Obviously."',
      'She brought the paperback to the counter and paid for it while he wrapped it in brown paper without her asking, the way bookshops used to and mostly no longer did. "The rain is still going," he said.',
      '"I\'ll manage."',
      '"I have a dry umbrella," he said, without additional inflection. Just the fact of it, available or not, up to her.',
      'She stood there for a moment. She thought about the broken umbrella she had left somewhere in the rain. She thought about the novel sitting open on her desk at home, three years and not yet halfway through.',
      '"Tell me about the signed first edition," she said.',
      'Something in his expression that was not quite a smile but was in the direction of one. "It\'s this way," he said.',
    ],
  },
  {
    number: 2,
    title: 'The Space Between Words',
    paragraphs: [
      'The dry umbrella became a reason to return.',
      'Ese told herself it was not a reason, that she simply liked the bookshop, that she passed it on the way to the café where she worked two mornings a week, that this was coincidence stratified into habit. But she had always been more honest in writing than in thought, and somewhere in the notebook she carried everywhere she had been writing dialogue that sounded like Malik since the third visit.',
      'On the fourth visit she found him with his sleeves rolled up, working on the binding of a damaged hardcover with the focused patience of someone who does not distinguish between valuable and ordinary when it comes to things that deserve care.',
      '"That one\'s not worth much," she said, looking at the book.',
      '"Everything is worth care," he said, without the tone of someone making a philosophical statement. As if this were simply a fact that organised his daily life. "The ink is still good. The story is still in there. The cover is the only thing that failed it."',
      'She sat on the stool across his worktable that she had started thinking of as her stool — which was the kind of thought she was monitoring.',
      '"I\'m stuck," she said.',
      '"Where?"',
      '"Chapter eleven. My main character has been writing unsent letters for ten chapters. Now she has to decide to send one and I don\'t know what changes. Nothing external has changed. She\'s the same person, he\'s the same person, the situation is the same."',
      'Malik did not look up from the binding. "Something internal changed," he said. "The letters stopped being honest and started being performances. She caught herself writing what she wished were true instead of what was."',
      'Ese was quiet for a long moment.',
      'She thought about the letters her character had been writing. She thought about when, precisely, they had shifted. She thought about the notebook in her bag where she had been writing dialogue that sounded like Malik for three weeks, and how it had started as observation and had at some point — she couldn\'t name the exact page — become something else entirely without her noticing the transition.',
      '"You were already there," he said. "You just needed someone to say it out loud."',
      'They ate dinner behind the counter that night — jollof rice from the woman three streets over, the shop locked and the closed sign turned, the rain starting again outside with its late-season persistence. He told her he had studied literature at Ibadan, learned bookbinding from an uncle, opened the shop with money his father had intended for something more practical.',
      '"He came around," Malik said. "After a few years. He came in one day and spent forty minutes looking at everything, then said: \'You can see what you know about books and you can see what you don\'t.\' I think that was as close as he got to approval."',
      '"My mother read all my stories before she told anyone what I was writing," Ese said. "She never said they were good. She said they were mine. I didn\'t understand the difference until much later."',
      '"Do you now?"',
      '"I think so." She looked at the rain against the dark window. "Mine means: I won\'t tell you to stop."',
      'She went home at midnight. She sat down at her desk and opened the novel and wrote four pages without stopping — the letter that finally gets sent, the one her character had been drafting for ten chapters, the version that is honest because it assumes it will be read. She wrote it with the specific clarity of someone who has just received, from an unexpected quarter, the exact information she needed.',
      'She did not examine this too carefully. She simply wrote. The notebook on the desk beside her was already open to the page where the dialogue that sounded like Malik began.',
      'She closed it gently. She kept writing the other thing.',
    ],
  },
  {
    number: 3,
    title: 'Ink Dries Slowly',
    paragraphs: [
      'The misunderstanding arrived via a photograph.',
      'Someone at the literary festival where Ese read in February had taken a picture she hadn\'t noticed being taken, and the picture included Malik standing beside her in a way that looked particular to someone who didn\'t know the room had simply been crowded. The caption — "Ese and a mystery man" — was applied by someone who meant nothing by it and shared to enough people that it reached Tobi, who was Ese\'s ex of two years and who had retained the friendship on the understanding that the friendship was separate from the feelings. An understanding that apparently applied only until evidence challenged it.',
      'Tobi\'s message arrived at eleven at night. Not angry — worse than angry. Carefully composed, the kind of message someone has drafted three times. About how she had said she needed time alone. About how this seemed to contradict that. About how he had waited and was probably a fool for it.',
      'Ese sat with her phone for a long time.',
      'She thought about honesty. About her character\'s letters. About the thing Malik had said regarding covers failing books that were otherwise entirely intact. She thought about all the things she had not said out loud in the past eight weeks because she had been waiting until she was sure enough to say them properly, which was its own kind of deception — not lying, but choosing the easier silence.',
      'She called Tobi first. The conversation was painful and precise and took forty-five minutes and at the end of it something that had been uncertain was made certain, which was a different kind of painful — the clean kind, the kind that closes rather than opens.',
      'She went to the bookshop in the morning.',
      'Malik was not there. A note on the door in his handwriting said he would be back at noon. She sat on the step and wrote in her notebook for two hours — about a woman waiting on the step of a bookshop, the morning light coming in sideways, the city going about its business with no particular interest in her situation. She wrote it precisely, which was all she knew how to do.',
      'He arrived at noon and found her there.',
      '"You should have called," he said.',
      '"I wasn\'t ready to talk," she said. "I needed to write it first."',
      'He unlocked the door and they went inside and she told him about the photograph and Tobi and the forty-five-minute conversation. He listened the way he read — with the complete attention of someone who does not pre-determine endings, who does not begin forming a response before the sentence is finished. When she was done, the shop was very quiet.',
      '"I should have been clearer," she said. "Earlier. About what I was doing when I kept coming back."',
      '"About what, exactly?"',
      'She looked at him. He was looking at her with those reading eyes, and she understood that he had known the difference between observation and the other thing from very early on, and had been waiting for her to arrive at the same conclusion by her own route, because that was the kind of person he was — patient and attentive and entirely unwilling to rush what needed to arrive on its own terms.',
      '"About the fact that I\'ve been writing dialogue that sounds like you in my notebook for two months," she said. "And that it stopped being research approximately six weeks ago."',
      'He was quiet for a moment.',
      '"Ink dries slowly," he said finally.',
      '"What does that mean?"',
      '"It means I have time." He turned to open the shutters, letting in the morning. "I have the shop to run, twelve books that need rebinding, and I have been watching you figure this out for eight weeks. I am not in any particular hurry."',
      'The light came in sideways, catching the dust, catching the spines of ten thousand books, and Ese stood in the middle of it with her notebook and her unfinished novel three kilometres away and her phone still warm from the call she had needed to make, and she felt the specific extraordinary relief of having written the honest version and sent it.',
      '"Eight weeks," she said.',
      '"Seven and a half. I was being generous."',
      'She laughed — a short sound, surprised clean out of her.',
      '"Show me the first edition again," she said.',
      'He smiled — properly this time, not the almost-smile she had been cataloguing for months.',
      '"It\'s this way," he said.',
    ],
  },
]

// ─── EXPORTED DATA ─────────────────────────────────────────────────────────

export const BOOKS: Book[] = [
  {
    slug:         'legend-of-leviticus',
    title:        'LEGEND OF LEVITICUS',
    subtitle:     'The Map That Burns',
    author:       'DYFF Studio',
    genre:        ['ACTION', 'SUPERNATURAL', 'DARK FANTASY'],
    synopsis:     'A map tattooed into his skin the night his father died. Seven gates between Leviticus and the truth about his bloodline. Lagos will never look the same.',
    accentColor:  '#8b0000',
    coverFrom:    'from-red-950',
    // Replace with the actual DYFF channel video ID for this title
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    chapterCount: 3,
    year:         2024,
    chapters:     leviticusChapters,
  },
  {
    slug:         'ese',
    title:        'ESE',
    subtitle:     'Some Things Are Written in Disappearing Ink',
    author:       'DYFF Studio',
    genre:        ['ROMANCE', 'DRAMA', 'LITERARY FICTION'],
    synopsis:     'Love letters written in disappearing ink. A woman who is more honest on paper than in person. A man who waits. Some things aren\'t meant to last — and some things won\'t stop.',
    accentColor:  '#6c00b3',
    coverFrom:    'from-purple-950',
    // Replace with the actual DYFF channel video ID for this title
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    chapterCount: 3,
    year:         2024,
    chapters:     eseChapters,
  },
]

export function getBook(slug: string): Book | undefined {
  return BOOKS.find(b => b.slug === slug)
}

export function getAllBookSlugs(): string[] {
  return BOOKS.map(b => b.slug)
}
