export abstract class SpriteModel {
    abstract tick(): void;

    abstract draw(context: CanvasRenderingContext2D);
}