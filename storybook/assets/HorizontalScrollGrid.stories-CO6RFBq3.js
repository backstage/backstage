import{j as s}from"./jsx-runtime-Cw0GR0a5.js";import{d as j,a as k}from"./ChevronRight-BD6X741e.js";import{c as h}from"./index-Cqve-NHl.js";import{r as m}from"./index-CTjT7uj6.js";import{m as z}from"./makeStyles-3WuthtJ7.js";import{B as g}from"./Box-BZcLdGyY.js";import{S as H}from"./Grid-Cd4CaOSn.js";import{I as $}from"./IconButton-BxJ-nFiT.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./typography-hVTC7Hfk.js";import"./ButtonBase-C1iu_4vV.js";import"./TransitionGroupContext-BtzQ-Cv7.js";const x=e=>{const t=e==="dark"?"16%":"97%";return`
    hsl(0, 0%, ${t}) 0%,
    hsla(0, 0%, ${t}, 0.987) 8.1%,
    hsla(0, 0%, ${t}, 0.951) 15.5%,
    hsla(0, 0%, ${t}, 0.896) 22.5%,
    hsla(0, 0%, ${t}, 0.825) 29%,
    hsla(0, 0%, ${t}, 0.741) 35.3%,
    hsla(0, 0%, ${t}, 0.648) 41.2%,
    hsla(0, 0%, ${t}, 0.55) 47.1%,
    hsla(0, 0%, ${t}, 0.45) 52.9%,
    hsla(0, 0%, ${t}, 0.352) 58.8%,
    hsla(0, 0%, ${t}, 0.259) 64.7%,
    hsla(0, 0%, ${t}, 0.175) 71%,
    hsla(0, 0%, ${t}, 0.104) 77.5%,
    hsla(0, 0%, ${t}, 0.049) 84.5%,
    hsla(0, 0%, ${t}, 0.013) 91.9%,
    hsla(0, 0%, ${t}, 0) 100%
  `},E=100,S=10,D=z(e=>({root:{position:"relative",display:"flex",flexFlow:"row nowrap",alignItems:"center"},container:{overflow:"auto",scrollbarWidth:0,"&::-webkit-scrollbar":{display:"none"}},fade:{position:"absolute",width:E,height:`calc(100% + ${S}px)`,transition:"opacity 300ms",pointerEvents:"none"},fadeLeft:{left:-S,background:`linear-gradient(90deg, ${x(e.palette.type)})`},fadeRight:{right:-S,background:`linear-gradient(270deg, ${x(e.palette.type)})`},fadeHidden:{opacity:0},button:{position:"absolute"},buttonLeft:{left:-e.spacing(2)},buttonRight:{right:-e.spacing(2)}}),{name:"BackstageHorizontalScrollGrid"});function G(e){const[[t,i],n]=m.useState([0,0]);return m.useLayoutEffect(()=>{const o=e.current;if(!o){n([0,0]);return}const a=()=>{const r=o.scrollLeft,l=o.scrollWidth-o.offsetWidth-o.scrollLeft;n([r,l])};return a(),o.addEventListener("scroll",a),window.addEventListener("resize",a),()=>{o.removeEventListener("scroll",a),window.removeEventListener("resize",a)}},[e]),[t,i]}function R(e,t,i){const[n,o]=m.useState(0);return m.useLayoutEffect(()=>{if(n===0)return;const a=window.performance.now(),r=requestAnimationFrame(l=>{if(!e.current)return;const p=l-a,u=Math.abs(n)*p/t,c=Math.max(i,u)*Math.sign(n);e.current.scrollBy({left:c});const f=n-c;Math.sign(n)!==Math.sign(f)?o(0):o(f)});return()=>cancelAnimationFrame(r)},[e,n,t,i]),o}function y(e){const{scrollStep:t=100,scrollSpeed:i=50,minScrollDistance:n=5,children:o,...a}=e,r=D(e),l=m.useRef(),[p,u]=G(l),b=R(l,i,n),c=f=>{l.current&&b(f?t:-t)};return s.jsxs(g,{...a,className:r.root,children:[s.jsx(H,{container:!0,direction:"row",wrap:"nowrap",className:r.container,ref:l,children:o}),s.jsx(g,{className:h(r.fade,r.fadeLeft,{[r.fadeHidden]:p===0})}),s.jsx(g,{className:h(r.fade,r.fadeRight,{[r.fadeHidden]:u===0})}),p>0&&s.jsx($,{title:"Scroll Left",onClick:()=>c(!1),className:h(r.button,r.buttonLeft,{}),children:s.jsx(j,{})}),u>0&&s.jsx($,{title:"Scroll Right",onClick:()=>c(!0),className:h(r.button,r.buttonRight,{}),children:s.jsx(k,{})})]})}y.__docgenInfo={description:`Horizontal scrollable component with arrows to navigate

@public`,methods:[],displayName:"HorizontalScrollGrid",props:{scrollStep:{required:!1,tsType:{name:"number"},description:""},scrollSpeed:{required:!1,tsType:{name:"number"},description:""},minScrollDistance:{required:!1,tsType:{name:"number"},description:""}}};const _={height:0,padding:150,margin:20},N={width:800,height:400,margin:20},T=[.2,.3,.4,.5,.6,.7,.8,.9,1],ct={title:"Layout/HorizontalScrollGrid",component:y},d=()=>s.jsx("div",{style:N,children:s.jsx(y,{children:T.map(e=>{const t={backgroundColor:`rgba(0, 185, 151, ${e})`};return s.jsx("div",{style:{...t,..._}},e)})})});d.__docgenInfo={description:"",methods:[],displayName:"Default"};var w,L,v;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`() => <div style={containerStyle}>
    <HorizontalScrollGrid>
      {opacityArray.map(element => {
      const style = {
        backgroundColor: \`rgba(0, 185, 151, \${element})\`
      };
      return <div style={{
        ...style,
        ...cardContentStyle
      }} key={element} />;
    })}
    </HorizontalScrollGrid>
  </div>`,...(v=(L=d.parameters)==null?void 0:L.docs)==null?void 0:v.source}}};const dt=["Default"];export{d as Default,dt as __namedExportsOrder,ct as default};
