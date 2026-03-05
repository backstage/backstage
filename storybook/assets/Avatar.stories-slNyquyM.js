import{j as l,c as h}from"./iframe-Zkjja1CZ.js";import{c as d}from"./index-CHk62GMG.js";import{m as u}from"./makeStyles-Dy9T_vRY.js";import{M as f}from"./Avatar-CR58suW6.js";import"./preload-helper-PPVm8Dsz.js";function N(a){let e=0;for(let t=0;t<a.length;t++)e=a.charCodeAt(t)+((e<<5)-e);let s="#";for(let t=0;t<3;t++){const i=e>>t*8&255;s+=`00${i.toString(16)}`.slice(-2)}return s}function x(a){const e=a.replace(/\([^)]{0,1000}\)/g,"").replace(/\[[^\]]{0,1000}\]/g,"").trim().split(/\s+/).map(i=>i.replace(/[^A-Za-z\u00C0-\u017F]/g,"")).filter(Boolean),s=e[0]??"",t=e.length>1?e[e.length-1]:"";return s&&t?`${s.charAt(0)}${t.charAt(0)}`:s.charAt(0)}const A=u(a=>({avatar:{width:"4rem",height:"4rem",color:a.palette.common.white,backgroundColor:e=>e.backgroundColor},avatarText:{fontWeight:a.typography.fontWeightBold,letterSpacing:"1px",textTransform:"uppercase"}}),{name:"BackstageAvatar"});function m(a){const{displayName:e,picture:s,customStyles:t}=a,i={...t},y={fontFamily:i.fontFamily,fontSize:i.fontSize,fontWeight:i.fontWeight},p=A(s?{}:{backgroundColor:N(e||"")}),g=d(a.classes?.avatar,p.avatar),v=d(a.classes?.avatarText,p.avatarText);return l.jsx(f,{alt:e,src:s,className:g,style:i,children:e&&l.jsx(h,{variant:"h6",component:"span",className:v,style:y,children:x(e)})})}m.__docgenInfo={description:`Component rendering an Avatar

@public
@remarks

Based on https://v4.mui.com/components/avatars/#avatar with some styling adjustment and two-letter initials`,methods:[],displayName:"Avatar",props:{displayName:{required:!1,tsType:{name:"string"},description:"A display name, which will be used to generate initials as a fallback in case a picture is not provided."},picture:{required:!1,tsType:{name:"string"},description:"URL to avatar image source"},customStyles:{required:!1,tsType:{name:"CSSProperties"},description:`Custom styles applied to avatar
@deprecated - use the classes property instead`},classes:{required:!1,tsType:{name:"signature",type:"object",raw:"{ [key in 'avatar' | 'avatarText']?: string }",signature:{properties:[{key:{name:"union",raw:"'avatar' | 'avatarText'",elements:[{name:"literal",value:"'avatar'"},{name:"literal",value:"'avatarText'"}],required:!1},value:{name:"string"}}]}},description:"Custom styles applied to avatar"}}};const S=u({avatar:{width:"24px",height:"24px",fontSize:"8px"}}),_={title:"Data Display/Avatar",component:m,tags:["!manifest"]},r=()=>l.jsx(m,{displayName:"Jenny Doe",picture:"https://avatars1.githubusercontent.com/u/72526453?s=200&v=4"}),o=()=>l.jsx(m,{displayName:"Jenny Doe"}),n=()=>l.jsx(m,{}),c=()=>{const a=S();return l.jsx(m,{displayName:"Jenny Doe",classes:a})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"NameFallback"};n.__docgenInfo={description:"",methods:[],displayName:"Empty"};c.__docgenInfo={description:"",methods:[],displayName:"CustomStyling"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <Avatar
    displayName="Jenny Doe"
    // Avatar of the backstage GitHub org
    picture="https://avatars1.githubusercontent.com/u/72526453?s=200&v=4"
  />
);
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const NameFallback = () => <Avatar displayName="Jenny Doe" />;
`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Empty = () => <Avatar />;
`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const CustomStyling = () => {
  const classes = useStyles();
  return <Avatar displayName="Jenny Doe" classes={classes} />;
};
`,...c.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <Avatar displayName="Jenny Doe"
// Avatar of the backstage GitHub org
picture="https://avatars1.githubusercontent.com/u/72526453?s=200&v=4" />`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'() => <Avatar displayName="Jenny Doe" />',...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"() => <Avatar />",...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <Avatar displayName="Jenny Doe" classes={classes} />;
}`,...c.parameters?.docs?.source}}};const j=["Default","NameFallback","Empty","CustomStyling"];export{c as CustomStyling,r as Default,n as Empty,o as NameFallback,j as __namedExportsOrder,_ as default};
