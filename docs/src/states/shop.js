PunchemOut.shopState = function () {

}

PunchemOut.shopState.prototype = {

    init: function () {

        if (game.global.DEBUG_MODE) {
            console.log("[DEBUG] Entering **SHOP** state");
        }
    },

    preload: function () {

    },

    create: function () {
        comprado = this.add.text(game.world.centerX, 350, "Comprado!", style);
        comprado.anchor.setTo(0.5);
        comprado.alpha = 0;

        comprarPowerUp = this.add.button(game.world.centerX, 300, 'skeleton', function() { comprado.alpha = 1; game.add.tween(comprado).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 1000);}, this, 2, 1, 0);
        comprarPowerUpText = this.add.text(game.world.centerX, 270, "Comprar Power Up", style)

        comprarPowerUp.anchor.setTo(0.5);
        comprarPowerUpText.anchor.setTo(0.5);

        back = this.add.button(50, 500, 'skeleton', function() { game.state.start('menuState'); }, this, 2, 1, 0);
        backText = game.add.text(110, 520, "Volver", style);
    },

    update: function () {
        
    }
}