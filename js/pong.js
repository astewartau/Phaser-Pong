var game = new Phaser.Game(800, 600, Phaser.AUTO,'gameDiv');

var paddle1;
var paddle2;
var ball;

var ball_launched;
var ball_velocity;

var score1_text;
var score2_text;

score1 = 0;
score2 = 0;

game.state.add('menu', {
  create: function() {
    var title_text = game.add.text(game.world.width / 2, game.world.height / 2 - 100, 'Pong', {
      font: "64px Consolas",
      fill: "#ffffff",
      align: "center"
    });
    title_text.anchor.setTo(0.5, 0.5);

    var instruction_text = game.add.text(game.world.width / 2, game.world.height - 100, 'Click to start!', {
      font: "32px Consolas",
      fill: "#ffffff",
      align: "center"
    });
    instruction_text.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(function() {
      game.state.start('game');
    }, this);
  },
});
game.state.add('game', {
  create: function() {
    ball_launched = false;
    ball_velocity = 400;

    paddle1 = create_paddle(game.world.centerX, game.world.height, 'paddle_blue');
    paddle2 = create_paddle(game.world.centerX, 0, 'paddle_orange');
    ball = create_ball(game.world.centerX, game.world.centerY);

    score2_text = game.add.text(game.world.width - 128, 128, '0', {
      font: "64px Consolas",
      fill: "#ffb330",
      align: "center"
    });
    score2_text.anchor.setTo(0.5, 0.5);

    score1_text = game.add.text(game.world.width - 128, game.world.height - 128, '0', {
      font: "64px Consolas",
      fill: "#698bff",
      align: "center"
    });
    score1_text.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(function() {
      if (!ball_launched) {
        launch_ball();
      }
    }, this);
  },
  preload: function() {
    game.load.image('paddle_blue', 'assets/paddle_blue.png');
    game.load.image('paddle_orange', 'assets/paddle_orange.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.audio('hit1', ['assets/hit.ogg']);
    game.load.audio('hit2', ['assets/hit2.ogg']);
    game.load.audio('score', ['assets/score.ogg']);
  },
  update: function() {
    // Paddle movement
    control_paddle(paddle1, game.input.x);
    if (Math.abs(ball.y - paddle2.y) < 200) {
      if (paddle2.x > ball.x + 10) {
        paddle2.body.velocity.setTo(-200, 0);
      } else if (paddle2.x < ball.x - 10){
        paddle2.body.velocity.setTo(200, 0);
      } else {
        paddle2.body.velocity.setTo(0, 0);
      }
    } else {
        paddle2.body.velocity.setTo(ball.body.velocity.x, 0);
    }
    paddle2.body.maxVelocity.x = 220;

    // Collisions
    game.physics.arcade.collide(paddle1, ball, function() {
      game.sound.play('hit1');
    });
    game.physics.arcade.collide(paddle2, ball, function() {
      game.sound.play('hit2');
    });

    // Scoring
    if (ball.body.blocked.up) {
      score1++;
      score1_text.text = score1;
      game.sound.play('score');
      launch_ball()
    } else if (ball.body.blocked.down) {
      score2++;
      score2_text.text = score2;
      game.sound.play('score');
      launch_ball()
    }

    // Prevent the ball from getting stuck
    if (ball_launched && ball.body.velocity.x == 0) {
      ball.body.velocity.x = ball_velocity;
    }
  }
});

function create_paddle(x, y, id) {
  var paddle = game.add.sprite(x, y, id);
  paddle.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(paddle);
  paddle.body.collideWorldBounds = true;
  paddle.body.immovable = true;
  paddle.scale.setTo(0.7, 0.5);
  return paddle;
}
function control_paddle(paddle, x) {
  // Move the paddle to the given position
  paddle.x = x;

  // Ensure the paddle remains in the game world
  if (paddle.x < paddle.width / 2) {
    paddle.x = paddle.width / 2;
  } else if (paddle.x > game.world.width - paddle.width / 2) {
    paddle.x = game.world.width - paddle.width / 2;
  }
}
function create_ball(x, y) {
  var ball = game.add.sprite(x, y, 'ball');
  ball.scale.setTo(0.5, 0.5);
  ball.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(ball);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.setTo(1, 1);

  return ball;
}
function launch_ball() {
  if (ball_launched) {
    ball.x = game.world.centerX;
    ball.y = game.world.centerY;
    ball.body.velocity.setTo(0, 0);
    ball_launched = false;
  } else {
    ball.body.velocity.x = -ball_velocity;
    ball.body.velocity.y = ball_velocity;
    ball_launched = true;
  }
}

game.state.start('menu');
