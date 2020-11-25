// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of availalbe elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
PennController.DebugOff();


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
Sequence("intro", "instructions", "training", "intermission", sepWithN( "break" , randomize("experiment") , 4), "debrief", SendResults(), "goodbye")


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(750)
        .start()
        .wait()
)
// .log( "Name" , getVar("ParticipantName") )
// Log the participant
//.log("Name", getVar("ParticipantName"))
.log("ParticipantID", PennController.GetURLParameter("participant") );
// This log command adds a column reporting the participant's name to every line saved to the results

newTrial( "intro" ,

    newText("Welcome!")
        .css("font-size", "1.2em")
        .print()
    ,
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can work uninterrupted.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>By clicking OK, you agree to the above. Let's get started!</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    /*newText("<p>Please enter your name below and press enter:</p>")
        .css("font-size", "1em")
        .center()
        .print()
    ,
    newTextInput()
        .center()
        .print()
        .wait()                 // The next command won't be executed until Enter is pressed
        .setVar( "ParticipantName" )
        // This setVar command stores the value from the TextInput element into the Var element
    ,*/
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
    ,
    // fullscreen()
) // intro message

newTrial("instructions" ,

    newText("<p><strong>The maze-experiment</strong></p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Your task is to read sentences as fast as possible: to read, you are given two words at a time.<br/>"+
        "The words appear side by side, but only <strong>one</strong> of them is a possible continuation of the sentence.<br/>"+
        "In other words, you need to find a way through a maze:</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newImage("maze", "lmaze.png")
        .size(200,)
        .center()
        .print()
    ,
    newText("<p>Use the <strong>left</strong> and <strong>right</strong> arrow keys to select the word that continues the sentence.<br/>" +
        "If you pick the wrong word, the sentence aborts and you will be given a new sentence.</p>" +
        "<p><strong>Please try to be quick <em>and</em> accurate.</strong><br/>" +
        "Errors are natural, sometimes even expected. However, please try to avoid errors<br/>" +
        "and pay close attention to what you are reading (reading out loud does help, sometimes).</p>"+
        "<p>We will start with practice sentences so you get used to the task. There will be up<br/>"+
        "to 10 practice sentences, but training ends when you have successfully mazed through 3 sentences<br/>"+
        "(then just wait a few seconds for the main experiment to load).</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Click OK when you are ready to begin.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
) // instructions

Template("training.csv", row =>
    newTrial("training",

        newVar("training_successes", 0)
            .global()
            .test.is(v => v > 1)
            .success(end())
        ,

        newController("Maze", {s: row.Sentence, a: row.Distractor})
            .css("font-size", "1.5em")
            .css("font-family", "Verdana")
            .print()
            .log()
            .wait()
            .remove()
            .test.passed()
            .failure(newText("<br/>oops!").css("font-size", "1.5em").css("color", "red").print())
            //.success(newText("<br/>great!").css("font-size", "1.5em").css("color", "green").print())
            .success(getVar("training_successes").set(v => v + 1), newText("<br/>great!").css("font-size", "1.5em").css("color", "green").print())

        ,
        newTimer(500).start().wait()
    )
) // defines template for the main experiment

newTrial("intermission" ,

    newText("<p>Well done, you should be good to go.<br/>" +
        "Remember: try to be quick <strong>and</strong> accurate.</p>" +
        "<p>The task is mostly fun, but also demanding, so there<br/>" +
        "will be a break every 5 sentences.<br/></p>" +
        "<p>(Please do not take a break <em>while</em> reading a sentence.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Click OK when you are ready to proceed to the main experiment.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
) // instructions

Template("sentences.csv", row =>
    newTrial("experiment",

        newController("Maze", {s: row.Sentence, a: row.Distractor})
            .css("font-size", "1.2em")
            .css("font-family", "Verdana")
            .print()
            .log()
            .wait()
            .remove()
            .test.passed()
            .failure(newText("<br/>oops!").css("font-size", "1.5em").css("color", "red").print())
            .success(newText("<br/>great!").css("font-size", "1.5em").css("color", "green").print())

        ,
        newTimer(500)
            .start()
            .wait()
    )
        // logs additional variables in sentence file (e.g., Fun)
        .log("Id", row.Id)
        .log("Group", row.Group)
        .log("Condition", row.Condition)
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )

) // defines template for the main experiment

newTrial("debrief",

    newText("<p>That's (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,

    newText("<p>Before you go, we'd appreciate it if you take a few moments to provide some feedback.<br/>" +
        "Providing the information is voluntary, but will help us in the evaluation of the results.</p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newText("<p>Please indicate your handedness:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("handedness", "right-handed", "left-handed", "no dominant hand", "rather not say")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
/*
    newDropDown("handedness", "Handedness:")
        .settings.add("right-handed", "left-handed", "no dominant hand", "rather not say")
        .print()
        .log()
    ,
*/
    newText("<p>With which hand did you do the experiment?</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("hand", "right", "left", "can't remember", "rather not say")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
/*
    newDropDown("hand", "Hand:")
        .settings.add("right", "left", "can't remember", "rather not say")
        .print()
        .log()
    ,
*/

    newText("<p>Feedback: How did you like this experiment? Difficult? Fun?</p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newTextInput("feedback", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,

    newText("<p>What do you think the experiment was about?</p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newTextInput("topic", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,

    newText("<p> </p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newButton("send", "Send results & proceed to verification link")
        .size(300)
        .center()
        .print()
        .wait()
)


SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>That's it, thank you very much for your time and effort!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Feedback: The task you just did tries to measure how we process sentences<br/>"+
        "of varying (presumed) complexity. More complex sentences take longer to read, but<br/>"+
        "complexity can be located in various places. Your participation helps us understand<br/>"+
        "how we understand and process sentences, at least a tiny bit!</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<a href='https://www.sfla.ch/'>Click here to validate your participation.</a>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
) // the good-bye message

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

_AddStandardCommands(function(PennEngine){
    this.test = {
        passed: function(){
            return !PennEngine.controllers.running.utils.valuesForNextElement ||
                !PennEngine.controllers.running.utils.valuesForNextElement.failed
        }
    }
});