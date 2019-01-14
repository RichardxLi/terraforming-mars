
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TitaniumMine implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Titanium Mine";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your titanium production 1 step";
    public description: string = "Titanium is useful to the space industry because of its great strength";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.titaniumProduction++;
        });
    }
}