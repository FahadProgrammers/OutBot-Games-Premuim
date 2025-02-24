import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collector, ComponentType, Message, TextChannel, User } from "discord.js";
import { createRouletteGifImage, shuffleArray } from "roulette-image";
import rouletteGame from "../../schema/Roulette/SchemaRoulette";
import roulettePoint from "../../schema/Roulette/SchemaRoulettePoints";

type Button = {
  custom_id: string;
  disabled?: boolean;
  label?: string;
  [key: string]: any; // For additional button properties
};

type Component = {
  components: Button[];
  [key: string]: any; // For additional component properties
};

type Messagee = {
  components: Component[];
};

interface dataInterface {
  user: User,
  number: Number,
  username: String,
  userId: String,
  color: String,
  image: String
};

export const disabledMultipleButtons = async (
  mm: Messagee,
  specific_custom_id?: string,
  username?: string,
  is_leave: boolean = false
): Promise<Component[]> => {
  mm.components.forEach((a, i) => {
    a.components.forEach((b, e) => {
      if (
        specific_custom_id &&
        mm.components[i].components[e].custom_id.includes(specific_custom_id)
      ) {
        mm.components[i].components[e].disabled = is_leave ? false : true;
        if (username) {
          mm.components[i].components[e].label = is_leave
            ? `${+mm.components[i].components[e].custom_id.split("_")[1] + 1}`
            : username;
        }
      } else if (!specific_custom_id) {
        mm.components[i].components[e].disabled = true;
      }
    });
  });

  return mm.components;
}


function getMultipleButtons(all_buttons: Button[]): Component[] {
  let components: Component[] = [];
  for (let i = 0; i < all_buttons.length; i += 5) {
    let component: Component = { components: [], type: 1 };
    for (let btn of all_buttons.slice(i, i + 5)) {
      component.components.push(btn);
    }
    components.push(component);
  }
  return components;
}

interface Player {
  security?: true;
  winner?: boolean; 
  user: any; 
  username: string;
  userId: string;
  number: number;
  image: string 
};

interface id {
  guildId: string;
  channelId: string; 
  number: number;
  msgId: string;
}

async function sendGameMessage(
  message: Message, // Or use Message if you're not using slash commands
  winner: dataInterface,
  players: Player[],
  id: id,
) {
  // Generate buttons for players
  const buttons = players
    .slice(0, -1) // Remove the last player
    .slice(0, 24) // Discord limit: Max 25 buttons per action row
    .map((player) =>
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary) // Secondary button style
        .setLabel(`${player.number + 1}. ${player.username}`)
        .setEmoji("<:emoji_33:1327724772167127201>")
        .setCustomId(`roulette_kick_${player.userId}_${message.guildId}_${id}_${player.number}`)
    );

  // Add the "Withdraw" button
  buttons.push(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger) // Danger button style
      .setLabel("انسحاب") // Arabic for "Withdraw"
      .setEmoji("<:emoji_30:1327724585562407024>>")
      .setCustomId(`roulette_withdraw_${winner.userId}_${message.guild?.id}_${id}_${winner?.number}`)
  );

  const buttonss = [];
  buttonss.push(
    new ButtonBuilder()
                .setEmoji("<:emoji_24:1327724457732603945>")
                .setLabel("إلغاء جوله روليت")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`roulette_cancel_${winner.user.id}_${message.guild?.id}_${id}_${winner?.number}`),              
  )

  // Group buttons into ActionRows (max 5 buttons per row)

  const rows2: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let i = 0; i < buttonss.length; i += 5) {
    rows2.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttonss.slice(i, i + 5)));
  }
  // Send the message
  const gameMessage = await (message.channel as TextChannel).send({
    content: `<@${winner.userId}> لديك **15 ثانية** لإختيار لاعب لطرده`, // Arabic: "You have 30 seconds to select a player to kick"
    components: rows2,
  });

  setTimeout(function() {
    buttons.push(
      new ButtonBuilder()
                  .setEmoji("<:emoji_24:1327724457732603945>")
                  .setLabel("إلغاء جوله روليت")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId(`roulette_cancel_${winner.user.id}_${message.guild?.id}_${id}_${winner?.number}`),              
    )
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < buttons.length; i += 5) {
      rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(i, i + 5)));
    }
  
    gameMessage.edit({
      content: `<@${winner.userId}> لديك **15 ثانية** لإختيار لاعب لطرده`, // Arabic: "You have 30 seconds to select a player to kick"
      components: rows
    })
  }, 3000);
  const msgcoll = gameMessage.createMessageComponentCollector({
    time: 15000, // الوقت المسموح لجمع التفاعلات
    filter: f => !f.user.bot, // استبعاد البوتات
    componentType: ComponentType.Button, // تحديد أن التفاعل المطلوب هو ضغط زر
  });
  
  msgcoll.on("end", async (collected) => {
    if (collected.size === 0) {
      const components = gameMessage.components.map((row) => {
            const actionRow = new ActionRowBuilder<ButtonBuilder>();
      
                row.components.forEach((component) => {
                  if (component.type === ComponentType.Button) {
                    const buttonData = {
                      ...component,
                      url: component.url ?? undefined, // معالجة الحقل `url`
                      label: component.label ?? "زر بدون عنوان", // توفير نص افتراضي
                      style: component.data.style ?? ButtonStyle.Primary,
                      custom_id:
                        component.customId ?? `${message.author.id}_${winner.number}`,
                      emoji: component.emoji ?? { name: ":fire:" },
                      disabled: true
                    };
      
                    if (!buttonData.label && !(component.data as any).emoji) {
                      buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                    }
                    actionRow.addComponents(new ButtonBuilder(buttonData));
                  }
                });
      
                return actionRow;
              }) as ActionRowBuilder<ButtonBuilder>[];
      
      
      
                await gameMessage.edit({
                  components: components.map((row) => row.toJSON()),
              });

       gameMessage.reply({
        content: `<:emoji_29:1327724572635697345> | لم يتم التفاعل مع الزر! لذا تم طرد <@${winner.userId}>`
      });
        const findRoulette = await rouletteGame.findOne({
                guildId: message.guild?.id,
                channelId: message.channel?.id,
                msgId: id,
              });

      const find = findRoulette?.players.find(
        (p) => p.number === Number(winner.number)
      );
      if (find && findRoulette) {
        findRoulette.players = findRoulette.players.filter(
          (x) => x.number != Number(winner.number)
        );
        await findRoulette.save();
      }
    
      await startRouletteGame(message, findRoulette?.players, message.client, id)
    }
  });
  

  return gameMessage;
}



export const startRouletteGame = async (message: Message, users: any, client: Client, id: any) => {
  try {
    // Define the available colors for the roulette wheel
    const colorsGradient = [
      "#32517f",
      "#4876a3",
      "#5d8ec7",
      "#74a6eb",
      "#8ac0ff",
    ];

    // Example options for players, you can adjust this to fetch users dynamically
    const options = users.map((data: any) => ({
      user: data.user, // Replace with actual user information
      label: data.username,
      color: colorsGradient[Math.floor(Math.random() * colorsGradient.length)], // Random color
    }));
    

    const sectors = users.map((data: dataInterface) => ({
      user: data.user,
      number: data.number,
      username: data.username,
      userId: data.userId,
      color: colorsGradient[Math.floor(Math.random() * colorsGradient.length)], // Random color
      image: data.image,
    }));

    if (message.channel instanceof TextChannel) {
      let players = shuffleArray(
        sectors.sort((a: any, b: any) => a.number - b.number, 0)
      );
      let winnerr = players[players.length - 1];

      // let bufferRouletteImage = await createRouletteGifImage(players);
      // await message.channel.send({
      //   content: `**${winner.number + 1}** - <@${winner.userId}>`,
      //   files: [
      //     {
      //       attachment: bufferRouletteImage,
      //       name: "roulette.gif",
      //     },
      //   ],
      // });
      const { Wheel } = require('roulette-gif')
      const wheel = new Wheel()
      
    
      let { 
        buffer, 
        winner, 
        lastFrame 
      } = await wheel.createGif({
        slots: sectors.sort((a: any, b: any) => a.number - b.number, 0),
        stream: false, // Set it to true if you want to return stream insted of buffer
        wheelStroke: {
          color: '#fff',
          width: 5
        },

        slotStroke: {
          color: '#fff',
          width: 5
        },
        imageStroke: {
          color: '#fff',
          width: 5
        },
        // winnerSlotColor: 'Gold'
      });

            await message.channel.send({
        content: `**${winner.number}** - <@${winner.userId}>`,
        files: [
          {
            attachment: buffer,
            name: "roulette.gif",
          },
        ],
      });

      if (players.length <= 2 && message.channel instanceof TextChannel) {
        await message.channel.send({
          content: `:crown: - فاز <@!${winner.userId}> في اللعبة`,
        });

        const findRoulette = await rouletteGame.findOne({
          guildId: message.guild?.id,
          channelId: message.channel?.id,
          msgId: id,
        });

        const xpJoiner = 2;
        const xpWinner = 5;
        const xpJoinerDobule = xpJoiner * 2;
        const xpWinnerDobule = xpWinner * 2;

       
        findRoulette?.players.forEach(async (p) => {
          const findP = await roulettePoint.findOne({
            userId: p.userId,
            guildId: message?.guildId,
          });
        if(findRoulette?.dobule === true) {
          
            if(!findP) {
              if(winner.userId === p.userId) {
                new roulettePoint({
                  guildId: message?.guildId,
                  userId: p.userId,
                  p: xpWinnerDobule                
                }).save();                
              } else {
              new roulettePoint({
                guildId: message?.guildId,
                userId: p.userId,
                p: xpJoinerDobule              
              }).save();
            }
            } else {
              if(winner.userId === p.userId) {
              findP.p += xpWinnerDobule;
              await findP.save();
            } else {
              findP.p += xpJoinerDobule;
              await findP.save();
            }
          }
        } else {
          const findP = await roulettePoint.findOne({
            guildId: message?.guildId,
            userId: p.userId
          });

          if(!findP) {
            if(winner.userId === p.userId) {
              new roulettePoint({
                guildId: message?.guildId,
                userId: p.userId,
                p: xpWinner              
              }).save();                
            } else {
            new roulettePoint({
              guildId: message?.guildId,
              userId: p.userId,
              p: xpJoiner            
            }).save();
          }
          } else {
            if(winner.userId === p.userId) {
            findP.p += xpWinner;
            await findP.save();
          } else {
            findP.p += xpJoiner;
            await findP.save();
          }
        }
        await findRoulette?.deleteOne();
      } 
      })
        } else {
        await sendGameMessage(message, winner, players, id);
      }
    }
  } catch (err) {
    console.error("Error in starting roulette game:", err);
  }
};
