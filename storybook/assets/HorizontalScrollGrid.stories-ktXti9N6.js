import{j as s}from"./jsx-runtime-hv06LKfz.js";import{C as w,a as v}from"./ChevronRight-BVd_2C9x.js";import{c as h}from"./index-DlxYA1zJ.js";import{r as m}from"./index-D8-PC79C.js";import{m as L}from"./makeStyles-CJp8qHqH.js";import{B as g}from"./Box-dSpCvcz2.js";import{S as j}from"./Grid-8Ap4jsYG.js";import{I as x}from"./IconButton-tgA3biVt.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./defaultTheme-NkpNA350.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./typography-Mwc_tj4E.js";import"./ButtonBase-DXo3xcpP.js";import"./TransitionGroupContext-CcnbR2YJ.js";const $=e=>{const t=e==="dark"?"16%":"97%";return`
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
  `},k=100,S=10,z=L(e=>({root:{position:"relative",display:"flex",flexFlow:"row nowrap",alignItems:"center"},container:{overflow:"auto",scrollbarWidth:0,"&::-webkit-scrollbar":{display:"none"}},fade:{position:"absolute",width:k,height:`calc(100% + ${S}px)`,transition:"opacity 300ms",pointerEvents:"none"},fadeLeft:{left:-S,background:`linear-gradient(90deg, ${$(e.palette.type)})`},fadeRight:{right:-S,background:`linear-gradient(270deg, ${$(e.palette.type)})`},fadeHidden:{opacity:0},button:{position:"absolute"},buttonLeft:{left:-e.spacing(2)},buttonRight:{right:-e.spacing(2)}}),{name:"BackstageHorizontalScrollGrid"});function H(e){const[[t,i],n]=m.useState([0,0]);return m.useLayoutEffect(()=>{const r=e.current;if(!r){n([0,0]);return}const a=()=>{const o=r.scrollLeft,l=r.scrollWidth-r.offsetWidth-r.scrollLeft;n([o,l])};return a(),r.addEventListener("scroll",a),window.addEventListener("resize",a),()=>{r.removeEventListener("scroll",a),window.removeEventListener("resize",a)}},[e]),[t,i]}function C(e,t,i){const[n,r]=m.useState(0);return m.useLayoutEffect(()=>{if(n===0)return;const a=window.performance.now(),o=requestAnimationFrame(l=>{if(!e.current)return;const p=l-a,u=Math.abs(n)*p/t,c=Math.max(i,u)*Math.sign(n);e.current.scrollBy({left:c});const f=n-c;Math.sign(n)!==Math.sign(f)?r(0):r(f)});return()=>cancelAnimationFrame(o)},[e,n,t,i]),r}function y(e){const{scrollStep:t=100,scrollSpeed:i=50,minScrollDistance:n=5,children:r,...a}=e,o=z(e),l=m.useRef(),[p,u]=H(l),b=C(l,i,n),c=f=>{l.current&&b(f?t:-t)};return s.jsxs(g,{...a,className:o.root,children:[s.jsx(j,{container:!0,direction:"row",wrap:"nowrap",className:o.container,ref:l,children:r}),s.jsx(g,{className:h(o.fade,o.fadeLeft,{[o.fadeHidden]:p===0})}),s.jsx(g,{className:h(o.fade,o.fadeRight,{[o.fadeHidden]:u===0})}),p>0&&s.jsx(x,{title:"Scroll Left",onClick:()=>c(!1),className:h(o.button,o.buttonLeft,{}),children:s.jsx(w,{})}),u>0&&s.jsx(x,{title:"Scroll Right",onClick:()=>c(!0),className:h(o.button,o.buttonRight,{}),children:s.jsx(v,{})})]})}y.__docgenInfo={description:`Horizontal scrollable component with arrows to navigate

@public`,methods:[],displayName:"HorizontalScrollGrid",props:{scrollStep:{required:!1,tsType:{name:"number"},description:""},scrollSpeed:{required:!1,tsType:{name:"number"},description:""},minScrollDistance:{required:!1,tsType:{name:"number"},description:""}}};const E={height:0,padding:150,margin:20},R={width:800,height:400,margin:20},D=[.2,.3,.4,.5,.6,.7,.8,.9,1],lt={title:"Layout/HorizontalScrollGrid",component:y},d=()=>s.jsx("div",{style:R,children:s.jsx(y,{children:D.map(e=>{const t={backgroundColor:`rgba(0, 185, 151, ${e})`};return s.jsx("div",{style:{...t,...E}},e)})})});d.__docgenInfo={description:"",methods:[],displayName:"Default"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
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
  </div>`,...d.parameters?.docs?.source}}};const it=["Default"];export{d as Default,it as __namedExportsOrder,lt as default};
