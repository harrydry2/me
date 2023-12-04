import { $, $$ } from "./bling";

export function vimeoWatcher() {
  var iframe = $(".zzz__right-video iframe");
  var player = new Vimeo.Player(iframe);
  console.log(player, "brb");

  player.on("ended", function () {
    console.log("Finished");
  });
}
