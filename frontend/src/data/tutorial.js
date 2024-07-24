// src/data/tutorialSteps.js

const tutorialSteps = [
    {
      title: "Welcome to Project Tutorial!",
      content: "This short tutorial will walk you through all of the features of this application.",
      sub_content: "If you want to dive right in, feel free to press the 'Skip Tutorial' button below. Otherwise, press 'Next'!", 
      image: "./images/path.png"
    },
    {
      title: "What is a pathfinding algorithm?",
      content: "At its core, a pathfinding algorithm seeks to find the shortest path between two points. This application visualizes various pathfinding algorithms in action, and more!",  
      sub_content:'All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1',
      image: './images/demo.png'
    },

    {
        title: "Adding walls / Maze  Manullay",
        content: 'To Add Wall Press Cltr +  righClick  then Drag on the Grid to Draw Wall Manullay as per You Wish , ',
        sub_content:'Other Option, Double Tap on the grid and start Drawing Maze .To  Stop  Drawing Again Double Tap',
        image:"", 
        gif:'./images/maze_demo.gif'
     
      },  
      {
        title: "Automatic Maze Generation",
        content: 'Choose the Maze Gneration Type from the List and Press Generate Button',
        sub_content:'',
        image:"./images/maze_drop.png", 
        gif:''
     
      }, 
      {
        title: "Picking an algorithm",
        content: 'Choose an algorithm from the "Algorithms" drop-down menu.',
        sub_content:"Note that some algorithms are unweighted, while others are weighted. Unweighted algorithms do not take turns or weight nodes into account, whereas weighted ones do. Additionally, not all algorithms guarantee the shortest path.", 
        image:"./images/drop_menu1.png"
     
      },   
      {
          title: "Visualize !",
          content: 'Once  Algorithm is Chosen Press Visualize !',
          sub_content:'',
          image:"", 
          gif:'./images/visualize_demo.gif'
       
        },


          {
            title: "Animation Speed",
            content: ' Animation Speed Can Be Adjust By Draging the Below Field ',
            sub_content:'',
            image:"./images/animation_delay.png", 
            gif:''
         
          }, 
          {
            title: "Change Source and Destination",
            content: '  ',
            sub_content:'',
            image:"", 
            gif:'./images/changeNode.gif'
         
          },
          {
            title: "Clear Board ",
            content: ' Press Clear Board Button  ',
            sub_content:'To Clear All Walls and Visited Nodess',
            image:"", 
            gif:''
         
          },
          {
            title: "Enjoy!",
            content: 'I hope you have just as much fun playing around with this visualization tool as I had building it!',
            sub_content:'',
            image:"", 
            gif:''
         
          },
  
    // Add more steps as needed
  ];
  
  export default tutorialSteps;
  