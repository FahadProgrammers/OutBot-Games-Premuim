function fun(p: number) {
    let emoji, name, nexttrial, nextptrial, rank, badges;
if(p >= 0 && p <= 50) {
name = "لاعب عادي"
emoji = "<:tier2:1300918782369337415>"
nexttrial = "لاعب فنان"
nextptrial = 100
rank = 2;
badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>"]
} else if (p >= 51 && p <= 100) {
name = "لاعب فنان";
emoji = "<:tier3:1300913649589944330>";
nexttrial = "لاعب رهيب"
nextptrial = 200
rank = 3;
badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>", "<:tier3:1300913649589944330>"]
} else if (p >= 101 && p <= 200) {
name = "لاعب رهيب"
emoji = "<:tier4:1300914268585328761>"
nexttrial = "لاعب محترف"
nextptrial = 400
rank = 4;
badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>", "<:tier3:1300913649589944330>", "<:tier4:1300914268585328761>"]
} else if (p >= 201 && p <= 400) {
name = "لاعب محترف"
emoji = "<:tier5:1300914252605030512>"
nexttrial = "لاعب اسطوري"
nextptrial = 600
rank = 5;
badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>", "<:tier3:1300913649589944330>", "<:tier4:1300914268585328761>", "<:tier5:1300914252605030512>"]
} else if (p >= 401 && p <= 600) {
name = "لاعب اسطوري"
emoji = "<:tier6:1300914637205667870>"
nexttrial = "ملك الالعاب"
nextptrial = 1000;
rank = 6;
} else if (p >= 601 && p <= 1000) {
name = "ملك الالعاب"
emoji = "<:tier7:1300790146685472890>"
nexttrial = "الحد الاقصى"
nextptrial = 0;
rank = 7;
badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>", "<:tier3:1300913649589944330>", "<:tier4:1300914268585328761>", "<:tier5:1300914252605030512>", "<:tier6:1300914637205667870>", "<:tier7:1300790146685472890>"]
} else if(p >= 1000) {
    name = "ملك الالعاب"
    emoji = "<:king:1343372191487492127>"
    nexttrial = "الحد الاقصى"
    nextptrial = 0;
    rank = 7;
    badges = ["<:tier1:1300911919410188288>", "<:tier2:1300918782369337415>", "<:tier3:1300913649589944330>", "<:tier4:1300914268585328761>", "<:tier5:1300914252605030512>", "<:tier6:1300914637205667870>", "<:king:1343372191487492127>"]
} else {
name = "لاعب جديد"
emoji = "<:tier1:1300911919410188288>"
nexttrial = "لاعب عادي"
nextptrial = 50
rank = 1;
badges = ["<:tier1:1300911919410188288>"]
} 
return { name, emoji, nexttrial, nextptrial, rank, badges }
}

export default fun;