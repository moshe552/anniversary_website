let music; // Declare a global variable to store the audio object

class MemoryWidget {
  constructor(question, correctAnswer, imagePaths, musicPath, sentence) {
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.imagePaths = Array.isArray(imagePaths) ? imagePaths : [];
    this.musicPath = musicPath;
    this.sentence = sentence;
  }

  checkAnswer(answerElement, userInput, callback) {
    if (userInput === this.correctAnswer) {
      // Change the sentence in the header
  document.querySelector('header h1').innerText = this.sentence;

      music = new Audio(this.musicPath);
      music.play();

      let imageCount = 0;
      this.imagePaths.forEach((imagePath, index) => {
        setTimeout(() => {
          const image = new Image();
          image.onload = () => {
            const aspectRatio = image.width / image.height;

            if (aspectRatio > 1) {
              image.style.width = '40%';
              image.style.height = 'auto';
            } else {
              image.style.height = '40%';
              image.style.width = 'auto';
            }

            image.className = 'centered-image';
            document.body.appendChild(image);

            setTimeout(() => {
              image.remove();
              imageCount++;
              if (imageCount === this.imagePaths.length) {
                document.addEventListener('keydown', function spacePress(event) {
                  if (event.code === 'Space') {
                    document.removeEventListener('keydown', spacePress);
                    music.pause(); // Stop the music
                    music.currentTime = 0; // Reset to the beginning
                    callback();
                  }
                });
              }
            }, 1000);
          };

          image.src = imagePath;
        }, 1000 * index);
      });

      answerElement.remove();
    }
  }
}


let currentWidgetIndex = 0;

const widgetData = [
  {
    question: "היכן התקיימה הפגישה הראשונה שלנו?",
    correctAnswer: "בשביל הגישה למלון כפר המכביה",
    imagePaths: ["images/hmacbia/1.jpg", "images/hmacbia/2.jpg", "images/hmacbia/3.jpg", "images/hmacbia/4.jpg", "images/hmacbia/5.jpg", "images/hmacbia/6.jpg", "images/hmacbia/7.jpg", "images/hmacbia/8.jpg", "images/hmacbia/9.jpg"],
    musicPath: "music/משהו חדש.mp3",
    sentence: "כאן התחיל הסיפור המשותף שלנו",
    possibleAnswers: [
      "בשביל הגישה למלון כפר המכביה",
      "בלובי של מלון כפר המכביה",
      "ברחוב כהנמן"
    ],
  },
  {
    question: "היכן התקיימה הפגישה השנייה שלנו?",
    correctAnswer: "בלובי של מלון קראון פלאזה בירושלים",
    imagePaths: ["images/crowne plaza/1.jpg", "images/crowne plaza/2.jpg", "images/crowne plaza/3.jpg", "images/crowne plaza/4.jpg"],
    musicPath: "music/אור גדול.mp3",
    sentence: "פה כבר ידעתי שאת תהיי אישתי!",
    possibleAnswers: [
      "במלון רמדה בירושלים",
      "בלובי של מלון קראון פלאזה בירושלים",
      "ברחוב יפו בירושלים"
    ],
  },
];

function generateNextMemoryWidget() {
  const container = document.getElementById('memory-widgets-container');
  container.innerHTML = '';

  if (currentWidgetIndex >= widgetData.length) {
    return;
  }

  const widget = widgetData[currentWidgetIndex];
  const widgetInstance = new MemoryWidget(
    widget.question,
    widget.correctAnswer,
    widget.imagePaths,
    widget.musicPath,
    widget.sentence
  );

  const widgetDiv = document.createElement('div');
  widgetDiv.className = 'memory-widget';

  const questionParagraph = document.createElement('p');
  questionParagraph.innerText = widgetInstance.question;

  widgetDiv.appendChild(questionParagraph);

  const answerDiv = document.createElement('div');
  answerDiv.className = 'answer-div';

  widget.possibleAnswers.forEach((answer, i) => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `answer${currentWidgetIndex}`;
    radio.value = answer;
    radio.id = `answer${currentWidgetIndex}${i}`;

    const label = document.createElement('label');
    label.htmlFor = `answer${currentWidgetIndex}${i}`;
    label.innerText = answer;

    answerDiv.appendChild(radio);
    answerDiv.appendChild(label);
  });

  const submitButton = document.createElement('button');
  submitButton.innerText = 'Submit';
  submitButton.addEventListener('click', function () {
    const selectedRadio = answerDiv.querySelector('input[type="radio"]:checked');
    const answer = selectedRadio ? selectedRadio.value : '';
    widgetInstance.checkAnswer(widgetDiv, answer, () => {
      currentWidgetIndex++;
      generateNextMemoryWidget();
    });
  });

  answerDiv.appendChild(submitButton);
  widgetDiv.appendChild(answerDiv);
  container.appendChild(widgetDiv);
}

window.addEventListener('DOMContentLoaded', () => {
  generateNextMemoryWidget();
});
