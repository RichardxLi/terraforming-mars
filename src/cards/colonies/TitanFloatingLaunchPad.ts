import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { IResourceCard } from "../ICard";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";
import { ColonyName } from "../../colonies/ColonyName";
import { DeferredAction } from "../../deferredActions/DeferredAction";
import { SelectColony } from "../../inputs/SelectColony";
import { ColonyModel } from "../../models/ColonyModel";

export class TitanFloatingLaunchPad implements IProjectCard,IResourceCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.TITAN_FLOATER_LAUNCHPAD;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        const openColonies = game.colonies.filter(colony => colony.isActive && colony.visitor === undefined);

        if (this.resourceCount === 0 || openColonies.length === 0 || player.fleetSize <= player.tradesThisTurn) {
            game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 1, Tags.JOVIAN, "Add 1 floater to a Jovian card"));
            return undefined;
        }

        return new OrOptions(
            new SelectOption("Add 1 floater to a Jovian card", "Add floater", () => {
                game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 1, Tags.JOVIAN));
                return undefined;
            }),
            new SelectOption("Remove 1 floater on this card to trade for free", "Remove floater", () => {
                const coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);

                game.defer(new DeferredAction(
                    player,
                    () => new SelectColony("Select colony to trade with for free", "Select", coloniesModel, (colonyName: ColonyName) => {
                        openColonies.forEach((colony) => {
                            if (colony.name === colonyName) {
                                this.resourceCount--;
                                game.log("${0} traded with ${1}", b => b.player(player).colony(colony));
                                colony.trade(player, game);
                                return undefined;
                            }

                            return undefined;
                        });

                        return undefined;
                    })
                ));

                return undefined;
            })
        );
    }

    public play(player: Player, game: Game) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN));
        return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}
