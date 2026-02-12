import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { SportsArticle } from './entity/SportsArticle';

const seedArticles = [
  {
    title: 'Champions League Final: A Night to Remember',
    content:
      'The Champions League final delivered an unforgettable spectacle as two European giants clashed under the lights. Goals, drama, and passion filled every minute of a match that will be talked about for years to come. The atmosphere inside the stadium was electric, with fans creating a wall of sound that inspired their teams to push beyond their limits.',
    imageUrl: 'https://picsum.photos/seed/soccer/800/400',
  },
  {
    title: 'NBA Playoffs: Record-Breaking Performance',
    content:
      'In a stunning display of athleticism, the star point guard set a new playoff record with 58 points in a single game. The crowd erupted as he drained a deep three-pointer with seconds left on the clock, sealing the victory and sending his team to the conference finals. Analysts are already calling it one of the greatest individual performances in playoff history.',
    imageUrl: 'https://picsum.photos/seed/basketball/800/400',
  },
  {
    title: 'Grand Slam Tennis: The Rise of a New Champion',
    content:
      'A 21-year-old sensation captured her first Grand Slam title, defeating the world number one in straight sets. Her powerful serve and precise groundstrokes overwhelmed her experienced opponent, signaling a changing of the guard in women\'s tennis. After match point, she fell to her knees in tears, the culmination of years of hard work and dedication.',
    imageUrl: 'https://picsum.photos/seed/tennis/800/400',
  },
  {
    title: 'Formula 1: Dramatic Finish at Monaco Grand Prix',
    content:
      'Rain turned the Monaco Grand Prix into a chaotic thriller, with multiple lead changes and unexpected pit strategies. The eventual winner navigated treacherous conditions with remarkable skill, overtaking on the famous hairpin turn in a move that will go down in motorsport folklore. Safety cars and red flags added to the unpredictability of one of the most exciting races in recent memory.',
    imageUrl: 'https://picsum.photos/seed/f1/800/400',
  },
  {
    title: 'World Cup Qualifier: Underdog Triumphs',
    content:
      'In a result nobody saw coming, a small nation ranked 87th in the world defeated a traditional powerhouse 3-1 in a World Cup qualifying match. The victory sent shockwaves through the football world and reignited debate about the growing competitiveness of international football. Fans poured into the streets to celebrate what many are calling the greatest result in their country\'s sporting history.',
    imageUrl: 'https://picsum.photos/seed/worldcup/800/400',
  },
  {
    title: 'Olympic Swimming: Gold Medal Showdown',
    content:
      'The 100m freestyle final lived up to its billing as the race of the century. Separated by just 0.02 seconds at the touch, the gold medalist set a new Olympic record while the silver medalist matched the previous world record. Both swimmers embraced after the race in a show of sportsmanship that embodied the Olympic spirit.',
    imageUrl: 'https://picsum.photos/seed/swimming/800/400',
  },
  {
    title: 'Tour de France: Mountain Stage Shakeup',
    content:
      'The queen stage of this year\'s Tour de France delivered a major shakeup in the general classification. An audacious solo attack on the final climb of Alpe d\'Huez saw the race leader crack under pressure, losing over three minutes to a resurgent rival. The peloton faces a dramatically different battle entering the final week of the race.',
    imageUrl: 'https://picsum.photos/seed/cycling/800/400',
  },
  {
    title: 'Rugby World Cup: Semifinal Classic',
    content:
      'A pulsating semifinal kept fans on the edge of their seats as two rugby heavyweights traded tries in a breathtaking contest. The lead changed hands four times in the final quarter, with the winning drop goal coming in the 79th minute. Players from both sides collapsed on the field at the final whistle, physically and emotionally drained from one of the tournament\'s all-time great matches.',
    imageUrl: 'https://picsum.photos/seed/rugby/800/400',
  },
  {
    title: 'MLB: Perfect Game Thrown for First Time in 5 Years',
    content:
      'A 28-year-old pitcher achieved baseball immortality by throwing a perfect game — 27 batters faced, 27 batters retired. His fastball topped out at 99 mph while his slider was virtually unhittable. Teammates mobbed him on the mound as the sold-out stadium roared its approval. It was just the 24th perfect game in Major League Baseball history.',
    imageUrl: 'https://picsum.photos/seed/baseball/800/400',
  },
  {
    title: 'Boxing: Heavyweight Unification Bout Announced',
    content:
      'The two best heavyweights in the world have finally agreed to fight in a unification bout scheduled for December. The clash will determine the undisputed heavyweight champion for the first time in over a decade. Both fighters are undefeated, and the bout is expected to generate record pay-per-view numbers. Promoters have confirmed the fight will take place in a purpose-built outdoor arena.',
    imageUrl: 'https://picsum.photos/seed/boxing/800/400',
  },
  {
    title: 'Ice Hockey: Stanley Cup Overtime Thriller',
    content:
      'The Stanley Cup finals delivered an unforgettable overtime goal in game seven, sending fans into a frenzy as the underdog team claimed their first championship in franchise history. The winning goal came on a breakaway with just two minutes left in overtime, capping off a playoff run that nobody predicted.',
    imageUrl: 'https://picsum.photos/seed/hockey/800/400',
  },
  {
    title: 'Cricket World Cup: Century Under Pressure',
    content:
      'A stunning century under immense pressure guided the home team to a thrilling victory in the Cricket World Cup semifinal, with the winning runs scored off the final ball. The batsman, who had been struggling for form throughout the tournament, rose to the occasion when it mattered most, silencing his critics with an innings that will be replayed for generations.',
    imageUrl: 'https://picsum.photos/seed/cricket/800/400',
  },
  {
    title: 'MMA: Upset of the Year Shocks the World',
    content:
      'In the biggest upset of the year, an unranked fighter knocked out the reigning champion in the first round with a devastating left hook that nobody saw coming. The challenger, a late replacement who took the fight on just two weeks notice, celebrated wildly as the stunned crowd tried to process what they had just witnessed.',
    imageUrl: 'https://picsum.photos/seed/mma/800/400',
  },
  {
    title: 'Golf: Historic Major Championship Victory',
    content:
      'A 45-year-old veteran defied the odds to win his sixth major championship, holding off a charge from the world number one on a dramatic final day. His closing round of 65 included an eagle on the 72nd hole, clinching victory by a single stroke and proving that experience still counts at the highest level of the game.',
    imageUrl: 'https://picsum.photos/seed/golf/800/400',
  },
  {
    title: 'Athletics: World Record Smashed in 100m Sprint',
    content:
      'The world record in the 100 meters was shattered at the World Athletics Championships, with the new champion crossing the line in a breathtaking 9.58 seconds. The performance, aided by near-perfect conditions and a legal tailwind, sent shockwaves through the sport and reignited the debate about the limits of human speed.',
    imageUrl: 'https://picsum.photos/seed/athletics/800/400',
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const repo = AppDataSource.getRepository(SportsArticle);

  const count = await repo.count();
  if (count > 0) {
    console.log(`Database already has ${count} articles. Skipping seed.`);
    await AppDataSource.destroy();
    return;
  }

  for (const data of seedArticles) {
    const article = repo.create(data);
    await repo.save(article);
  }

  console.log(`Seeded ${seedArticles.length} articles successfully`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
