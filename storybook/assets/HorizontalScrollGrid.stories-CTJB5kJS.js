import{r as u,j as s,K as $}from"./iframe-C97aGyUm.js";import{C as v,a as w}from"./ChevronRight-BwsjzOCm.js";import{c as h}from"./index-J5_UG62z.js";import{m as L}from"./makeStyles-BH_X-duW.js";import{B as g}from"./Box-Df-ATJWc.js";import{S as k}from"./Grid-B4D-XE5H.js";import"./preload-helper-PPVm8Dsz.js";import"./styled-BJz5j31a.js";const x=t=>{const e=t==="dark"?"16%":"97%";return`
    hsl(0, 0%, ${e}) 0%,
    hsla(0, 0%, ${e}, 0.987) 8.1%,
    hsla(0, 0%, ${e}, 0.951) 15.5%,
    hsla(0, 0%, ${e}, 0.896) 22.5%,
    hsla(0, 0%, ${e}, 0.825) 29%,
    hsla(0, 0%, ${e}, 0.741) 35.3%,
    hsla(0, 0%, ${e}, 0.648) 41.2%,
    hsla(0, 0%, ${e}, 0.55) 47.1%,
    hsla(0, 0%, ${e}, 0.45) 52.9%,
    hsla(0, 0%, ${e}, 0.352) 58.8%,
    hsla(0, 0%, ${e}, 0.259) 64.7%,
    hsla(0, 0%, ${e}, 0.175) 71%,
    hsla(0, 0%, ${e}, 0.104) 77.5%,
    hsla(0, 0%, ${e}, 0.049) 84.5%,
    hsla(0, 0%, ${e}, 0.013) 91.9%,
    hsla(0, 0%, ${e}, 0) 100%
  `},j=100,y=10,z=L(t=>({root:{position:"relative",display:"flex",flexFlow:"row nowrap",alignItems:"center"},container:{overflow:"auto",scrollbarWidth:0,"&::-webkit-scrollbar":{display:"none"}},fade:{position:"absolute",width:j,height:`calc(100% + ${y}px)`,transition:"opacity 300ms",pointerEvents:"none"},fadeLeft:{left:-y,background:`linear-gradient(90deg, ${x(t.palette.type)})`},fadeRight:{right:-y,background:`linear-gradient(270deg, ${x(t.palette.type)})`},fadeHidden:{opacity:0},button:{position:"absolute"},buttonLeft:{left:-t.spacing(2)},buttonRight:{right:-t.spacing(2)}}),{name:"BackstageHorizontalScrollGrid"});function H(t){const[[e,i],n]=u.useState([0,0]);return u.useLayoutEffect(()=>{const o=t.current;if(!o){n([0,0]);return}const a=()=>{const r=o.scrollLeft,c=o.scrollWidth-o.offsetWidth-o.scrollLeft;n([r,c])};return a(),o.addEventListener("scroll",a),window.addEventListener("resize",a),()=>{o.removeEventListener("scroll",a),window.removeEventListener("resize",a)}},[t]),[e,i]}function C(t,e,i){const[n,o]=u.useState(0);return u.useLayoutEffect(()=>{if(n===0)return;const a=window.performance.now(),r=requestAnimationFrame(c=>{if(!t.current)return;const m=c-a,p=Math.abs(n)*m/e,d=Math.max(i,p)*Math.sign(n);t.current.scrollBy({left:d});const f=n-d;Math.sign(n)!==Math.sign(f)?o(0):o(f)});return()=>cancelAnimationFrame(r)},[t,n,e,i]),o}function S(t){const{scrollStep:e=100,scrollSpeed:i=50,minScrollDistance:n=5,children:o,...a}=t,r=z(t),c=u.useRef(),[m,p]=H(c),b=C(c,i,n),d=f=>{c.current&&b(f?e:-e)};return s.jsxs(g,{...a,className:r.root,children:[s.jsx(k,{container:!0,direction:"row",wrap:"nowrap",className:r.container,ref:c,children:o}),s.jsx(g,{className:h(r.fade,r.fadeLeft,{[r.fadeHidden]:m===0})}),s.jsx(g,{className:h(r.fade,r.fadeRight,{[r.fadeHidden]:p===0})}),m>0&&s.jsx($,{title:"Scroll Left",onClick:()=>d(!1),className:h(r.button,r.buttonLeft,{}),children:s.jsx(v,{})}),p>0&&s.jsx($,{title:"Scroll Right",onClick:()=>d(!0),className:h(r.button,r.buttonRight,{}),children:s.jsx(w,{})})]})}S.__docgenInfo={description:`Horizontal scrollable component with arrows to navigate

@public`,methods:[],displayName:"HorizontalScrollGrid",props:{scrollStep:{required:!1,tsType:{name:"number"},description:""},scrollSpeed:{required:!1,tsType:{name:"number"},description:""},minScrollDistance:{required:!1,tsType:{name:"number"},description:""}}};const G={height:0,padding:150,margin:20},D={width:800,height:400,margin:20},E=[.2,.3,.4,.5,.6,.7,.8,.9,1],F={title:"Layout/HorizontalScrollGrid",component:S,tags:["!manifest"]},l=()=>s.jsx("div",{style:D,children:s.jsx(S,{children:E.map(t=>{const e={backgroundColor:`rgba(0, 185, 151, ${t})`};return s.jsx("div",{style:{...e,...G}},t)})})});l.__docgenInfo={description:"",methods:[],displayName:"Default"};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{code:`const Default = () => (
  <div style={containerStyle}>
    <HorizontalScrollGrid>
      {opacityArray.map((element) => {
        const style = { backgroundColor: \`rgba(0, 185, 151, \${element})\` };
        return <div style={{ ...style, ...cardContentStyle }} key={element} />;
      })}
    </HorizontalScrollGrid>
  </div>
);
`,...l.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
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
  </div>`,...l.parameters?.docs?.source}}};const W=["Default"];export{l as Default,W as __namedExportsOrder,F as default};
