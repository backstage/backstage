const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DependencyGraphContent-pIitlhij.js","./iframe-Bm5ba6Eo.js","./preload-helper-PPVm8Dsz.js","./iframe-8TKB6NNd.css","./useIsomorphicLayoutEffect-ChAZlZKa.js","./index-ob8zNRki.js","./lodash-KBhUdAYx.js","./createStyles-yD3y8ldD.js","./styled-DeEwf9nS.js","./defineProperty-DBQ4-D-d.js","./isObject--vsEa_js.js","./isSymbol-BtnOBEK7.js","./makeStyles-BxPw9vCe.js","./Tooltip-Dj-fCTBD.js","./Popper-SjxBkGs3.js","./Portal-Cg5Nvqt2.js"])))=>i.map(i=>d[i]);
import{bR as e,ca as D}from"./iframe-Bm5ba6Eo.js";import{_ as x}from"./preload-helper-PPVm8Dsz.js";const E=D.lazy(()=>x(()=>import("./DependencyGraphContent-pIitlhij.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),import.meta.url).then(n=>({default:n.DependencyGraph})));function r(n){return e.jsx(D.Suspense,{fallback:e.jsx("div",{}),children:e.jsx(E,{...n})})}r.__docgenInfo={description:`Graph component used to visualize relations between entities

@public`,methods:[],displayName:"DependencyGraph",props:{edges:{required:!0,tsType:{name:"Array",elements:[{name:"Types.DependencyEdge",elements:[{name:"EdgeData"}],raw:"Types.DependencyEdge<EdgeData>"}],raw:"Types.DependencyEdge<EdgeData>[]"},description:"Edges of graph"},nodes:{required:!0,tsType:{name:"Array",elements:[{name:"Types.DependencyNode",elements:[{name:"NodeData"}],raw:"Types.DependencyNode<NodeData>"}],raw:"Types.DependencyNode<NodeData>[]"},description:"Nodes of Graph"},direction:{required:!1,tsType:{name:"Types.Direction"},description:`Graph {@link DependencyGraphTypes.(Direction:namespace) | direction}

@remarks

Default: \`DependencyGraphTypes.Direction.TOP_BOTTOM\``},align:{required:!1,tsType:{name:"Types.Alignment"},description:"Node {@link DependencyGraphTypes.(Alignment:namespace) | alignment}"},nodeMargin:{required:!1,tsType:{name:"number"},description:`Margin between nodes on each rank

@remarks

Default: 50`},edgeMargin:{required:!1,tsType:{name:"number"},description:`Margin between edges

@remarks

Default: 10`},rankMargin:{required:!1,tsType:{name:"number"},description:`Margin between each rank

@remarks

Default: 50`},paddingX:{required:!1,tsType:{name:"number"},description:`Margin on left and right of whole graph

@remarks

Default: 0`},paddingY:{required:!1,tsType:{name:"number"},description:`Margin on top and bottom of whole graph

@remarks

Default: 0`},acyclicer:{required:!1,tsType:{name:"literal",value:"'greedy'"},description:"Heuristic used to find set of edges that will make graph acyclic"},ranker:{required:!1,tsType:{name:"Types.Ranker"},description:`{@link DependencyGraphTypes.(Ranker:namespace) | Algorithm} used to rank nodes

@remarks

Default: \`DependencyGraphTypes.Ranker.NETWORK_SIMPLEX\``},labelPosition:{required:!1,tsType:{name:"Types.LabelPosition"},description:`{@link DependencyGraphTypes.(LabelPosition:namespace) | Position} of label in relation to edge

@remarks

Default: \`DependencyGraphTypes.LabelPosition.RIGHT\``},labelOffset:{required:!1,tsType:{name:"number"},description:`How much to move label away from edge

@remarks

Applies only when {@link DependencyGraphProps.labelPosition} is \`DependencyGraphTypes.LabelPosition.LEFT\` or
\`DependencyGraphTypes.LabelPosition.RIGHT\``},edgeRanks:{required:!1,tsType:{name:"number"},description:"Minimum number of ranks to keep between connected nodes"},edgeWeight:{required:!1,tsType:{name:"number"},description:"Weight applied to edges in graph"},renderEdge:{required:!1,tsType:{name:"Types.RenderEdgeFunction",elements:[{name:"EdgeData"}],raw:"Types.RenderEdgeFunction<EdgeData>"},description:"Custom edge rendering component"},renderNode:{required:!1,tsType:{name:"Types.RenderNodeFunction",elements:[{name:"NodeData"}],raw:"Types.RenderNodeFunction<NodeData>"},description:"Custom node rendering component"},renderLabel:{required:!1,tsType:{name:"Types.RenderLabelFunction",elements:[{name:"EdgeData"}],raw:"Types.RenderLabelFunction<EdgeData>"},description:"Custom label rendering component"},defs:{required:!1,tsType:{name:"union",raw:"JSX.Element | JSX.Element[]",elements:[{name:"JSX.Element"},{name:"Array",elements:[{name:"JSX.Element"}],raw:"JSX.Element[]"}]},description:`{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs | Defs} shared by rendered SVG to be used by
{@link DependencyGraphProps.renderNode} and/or {@link DependencyGraphProps.renderLabel}`},zoom:{required:!1,tsType:{name:"union",raw:"'enabled' | 'disabled' | 'enable-on-click'",elements:[{name:"literal",value:"'enabled'"},{name:"literal",value:"'disabled'"},{name:"literal",value:"'enable-on-click'"}]},description:`Controls zoom behavior of graph

@remarks

Default: \`enabled\``},curve:{required:!1,tsType:{name:"union",raw:"'curveStepBefore' | 'curveMonotoneX'",elements:[{name:"literal",value:"'curveStepBefore'"},{name:"literal",value:"'curveMonotoneX'"}]},description:`A factory for curve generators addressing both lines and areas.

@remarks

Default: 'curveMonotoneX'`},showArrowHeads:{required:!1,tsType:{name:"boolean"},description:`Controls if the arrow heads should be rendered or not.

Default: false`},fit:{required:!1,tsType:{name:"union",raw:"'grow' | 'contain'",elements:[{name:"literal",value:"'grow'"},{name:"literal",value:"'contain'"}]},description:`Controls if the graph should be contained or grow

@remarks

Default: 'grow'`},allowFullscreen:{required:!1,tsType:{name:"boolean"},description:`Controls if user can toggle fullscreen mode

@remarks

Default: true`}},composes:["SVGProps"]};var i;(n=>{n.Direction={TOP_BOTTOM:"TB",BOTTOM_TOP:"BT",LEFT_RIGHT:"LR",RIGHT_LEFT:"RL"},n.Alignment={UP_LEFT:"UL",UP_RIGHT:"UR",DOWN_LEFT:"DL",DOWN_RIGHT:"DR"},n.Ranker={NETWORK_SIMPLEX:"network-simplex",TIGHT_TREE:"tight-tree",LONGEST_PATH:"longest-path"},n.LabelPosition={LEFT:"l",RIGHT:"r",CENTER:"c"}})(i||(i={}));const _={title:"Data Display/DependencyGraph",component:r,tags:["!manifest"]},s={width:"100%"},o={border:"1px solid grey"},d=[{id:"source"},{id:"downstream"},{id:"second-downstream"},{id:"third-downstream"}],t=[{from:"source",to:"downstream"},{from:"downstream",to:"second-downstream"},{from:"downstream",to:"third-downstream"}],l=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,style:o,paddingX:50,paddingY:50})}),p=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,style:o,paddingX:50,paddingY:50,zoom:"disabled"})}),c=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,style:o,paddingX:50,paddingY:50,zoom:"enable-on-click"})}),m=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,direction:i.Direction.BOTTOM_TOP,style:o,paddingX:50,paddingY:50})}),g=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,direction:i.Direction.LEFT_RIGHT,style:o,paddingX:50,paddingY:50})}),y=()=>e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:t,direction:i.Direction.RIGHT_LEFT,style:o,paddingX:50,paddingY:50})}),u=()=>{const n=t.map(f=>({...f,label:"label"}));return e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:n,direction:i.Direction.LEFT_RIGHT,style:o,paddingX:50,paddingY:50})})},h=()=>{const n=["pink","coral","yellowgreen","aquamarine"],f=d.map((a,b)=>({...a,description:"Description text",color:n[b]}));return e.jsx("div",{style:s,children:e.jsx(r,{nodes:f,edges:t,style:o,paddingX:50,paddingY:50,renderNode:a=>e.jsxs("g",{children:[e.jsx("rect",{width:200,height:100,rx:20,fill:a.node.color}),e.jsx("text",{x:100,y:45,textAnchor:"middle",alignmentBaseline:"baseline",style:{fontWeight:"bold"},children:a.node.id}),e.jsx("text",{x:100,y:55,textAnchor:"middle",alignmentBaseline:"hanging",children:a.node.description})]})})})},T=()=>{const n=["pink","coral","aqua"],f=t.map((a,b)=>({...a,label:n[b],color:n[b]}));return e.jsx("div",{style:s,children:e.jsx(r,{nodes:d,edges:f,labelPosition:i.LabelPosition.CENTER,style:o,paddingX:50,paddingY:50,renderLabel:a=>e.jsxs("g",{children:[e.jsx("circle",{r:25,fill:a.edge.color}),e.jsx("text",{x:0,y:0,textAnchor:"middle",alignmentBaseline:"middle",children:a.edge.label})]})})})};l.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"ZoomDisabled"};c.__docgenInfo={description:"",methods:[],displayName:"ZoomEnableOnClick"};m.__docgenInfo={description:"",methods:[],displayName:"BottomToTop"};g.__docgenInfo={description:"",methods:[],displayName:"LeftToRight"};y.__docgenInfo={description:"",methods:[],displayName:"RightToLeft"};u.__docgenInfo={description:"",methods:[],displayName:"WithLabels"};h.__docgenInfo={description:"",methods:[],displayName:"CustomNodes"};T.__docgenInfo={description:"",methods:[],displayName:"CustomLabels"};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} style={graphStyle} paddingX={50} paddingY={50} />
  </div>`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} style={graphStyle} paddingX={50} paddingY={50} zoom="disabled" />
  </div>`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} style={graphStyle} paddingX={50} paddingY={50} zoom="enable-on-click" />
  </div>`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} direction={Types.Direction.BOTTOM_TOP} style={graphStyle} paddingX={50} paddingY={50} />
  </div>`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} direction={Types.Direction.LEFT_RIGHT} style={graphStyle} paddingX={50} paddingY={50} />
  </div>`,...g.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <DependencyGraph nodes={exampleNodes} edges={exampleEdges} direction={Types.Direction.RIGHT_LEFT} style={graphStyle} paddingX={50} paddingY={50} />
  </div>`,...y.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const edges = exampleEdges.map(edge => ({
    ...edge,
    label: 'label'
  }));
  return <div style={containerStyle}>
      <DependencyGraph nodes={exampleNodes} edges={edges} direction={Types.Direction.LEFT_RIGHT} style={graphStyle} paddingX={50} paddingY={50} />
    </div>;
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  const colors = ['pink', 'coral', 'yellowgreen', 'aquamarine'];
  const nodes = exampleNodes.map((node, index) => ({
    ...node,
    description: 'Description text',
    color: colors[index]
  }));
  return <div style={containerStyle}>
      <DependencyGraph nodes={nodes} edges={exampleEdges} style={graphStyle} paddingX={50} paddingY={50} renderNode={props => <g>
            <rect width={200} height={100} rx={20} fill={props.node.color} />
            <text x={100} y={45} textAnchor="middle" alignmentBaseline="baseline" style={{
        fontWeight: 'bold'
      }}>
              {props.node.id}
            </text>
            <text x={100} y={55} textAnchor="middle" alignmentBaseline="hanging">
              {props.node.description}
            </text>
          </g>} />
    </div>;
}`,...h.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
  const colors = ['pink', 'coral', 'aqua'];
  const edges = exampleEdges.map((edge, index) => ({
    ...edge,
    label: colors[index],
    color: colors[index]
  }));
  return <div style={containerStyle}>
      <DependencyGraph nodes={exampleNodes} edges={edges} labelPosition={Types.LabelPosition.CENTER} style={graphStyle} paddingX={50} paddingY={50} renderLabel={props => <g>
            <circle r={25} fill={props.edge.color} />
            <text x={0} y={0} textAnchor="middle" alignmentBaseline="middle">
              {props.edge.label}
            </text>
          </g>} />
    </div>;
}`,...T.parameters?.docs?.source}}};const v=["Default","ZoomDisabled","ZoomEnableOnClick","BottomToTop","LeftToRight","RightToLeft","WithLabels","CustomNodes","CustomLabels"],L=Object.freeze(Object.defineProperty({__proto__:null,BottomToTop:m,CustomLabels:T,CustomNodes:h,Default:l,LeftToRight:g,RightToLeft:y,WithLabels:u,ZoomDisabled:p,ZoomEnableOnClick:c,__namedExportsOrder:v,default:_},Symbol.toStringTag,{value:"Module"}));export{i as D,L as a};
