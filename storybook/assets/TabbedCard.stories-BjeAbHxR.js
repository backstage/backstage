import{ca as i,bR as e,c_ as O,aa as w,w as W}from"./iframe-hQz1Bovf.js";import{C as _,a as L}from"./CardContent-BeSrsLxZ.js";import{E as q}from"./ErrorBoundary-CIRZVXR1.js";import{b as H,T as I}from"./Tabs-CuxGiyPu.js";import{D as B}from"./Divider-DiKZVb6z.js";import{B as P}from"./BottomLink-BZCQ8dht.js";import{m as x}from"./makeStyles-CRkWSsAX.js";import{C as M}from"./CardHeader-BkkfDLMW.js";import{S}from"./Grid-BHtxnF4E.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-C9NtZi6r.js";import"./WarningPanel-EdrGZVs0.js";import"./ExpandMore-Cxdbkgw6.js";import"./AccordionDetails-B6N32r7a.js";import"./index-B9sM2jn7.js";import"./Collapse-DtRwyC7m.js";import"./MarkdownContent-bRZBSpSh.js";import"./Link-Bcq4-4Is.js";import"./index-tlBBGTW_.js";import"./lodash-BeTb6-To.js";import"./useAnalytics-1xUyB9Hg.js";import"./useApp-CNSTaFkm.js";import"./CodeSnippet-DZEoL2eY.js";import"./List-Czan3J2f.js";import"./ListContext-Dkj8oSFA.js";import"./ListItem-Cj74SqHm.js";import"./ListItemText-DkoBDy6-.js";import"./CopyTextButton-BuvWXcdK.js";import"./useCopyToClipboard-fpXyZL8l.js";import"./useMountedState-C3piaHue.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";import"./Portal-CPzfTq6t.js";import"./LinkButton-ssYwmTn3.js";import"./Button-CfoRjWz_.js";import"./KeyboardArrowRight-BWKQILKD.js";import"./ArrowForward-YyAeGU7-.js";import"./Box-CFfSeaSI.js";import"./styled-DjRvED2X.js";const R=x(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),D=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(M);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:v}=n,f=R(),[T,j]=i.useState(0),k=v||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===T&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(_,{children:e.jsxs(q,{...E,children:[u&&e.jsx(D,{title:u}),e.jsx(H,{classes:f,value:b||T,onChange:k,children:o}),e.jsx(B,{}),e.jsx(L,{children:h}),y&&e.jsx(P,{...y})]})})}const V=x(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function r(n){const{children:s,...l}=n,o=V();return e.jsx(I,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
  slackChannel?: string | SlackChannel;
  onError?: (error: Error, errorInfo: string) => null;
}`,signature:{properties:[{key:"slackChannel",value:{name:"union",raw:"string | SlackChannel",elements:[{name:"string"},{name:"signature",type:"object",raw:`{
  name: string;
  href?: string;
}`,signature:{properties:[{key:"name",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!1}}]}}],required:!1}},{key:"onError",value:{name:"signature",type:"function",raw:"(error: Error, errorInfo: string) => null",signature:{arguments:[{type:{name:"Error"},name:"error"},{type:{name:"string"},name:"errorInfo"}],return:{name:"null"}},required:!1}}]}}],raw:`PropsWithChildren<{
  slackChannel?: string | SlackChannel;
  onError?: (error: Error, errorInfo: string) => null;
}>`},description:""},children:{required:!1,tsType:{name:"Array",elements:[{name:"ReactElement",elements:[{name:"TabProps"}],raw:"ReactElement<TabProps>"}],raw:"ReactElement<TabProps>[]"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: ChangeEvent<{}>, value: number | string) => void",signature:{arguments:[{type:{name:"ChangeEvent",elements:[{name:"signature",type:"object",raw:"{}",signature:{properties:[]}}],raw:"ChangeEvent<{}>"},name:"event"},{type:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},name:"value"}],return:{name:"void"}}},description:""},title:{required:!1,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},deepLink:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  link: string;
  title: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}`,signature:{properties:[{key:"link",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLAnchorElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEvent<HTMLAnchorElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}},description:""}}};r.__docgenInfo={description:`Card tab component used in {@link TabbedCard}

@public`,methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const t={height:200,width:500},g=({children:n})=>e.jsx(W,{children:n}),Oe={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(S,{container:!0,spacing:4,children:e.jsx(S,{item:!0,children:n()})})],tags:["!manifest"]},d=()=>e.jsx(g,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),N={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:N,children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),c=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(w,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(r,{value:"one",label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{value:"two",label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{value:"three",label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{value:"four",label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};c.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  return <Wrapper>
      <TabbedCard title="Default Example Header">
        <CardTab label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>;
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  return <Wrapper>
      <TabbedCard title="Footer Link Example Header" deepLink={linkInfo}>
        <CardTab label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>;
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [selectedTab, setSelectedTab] = useState<string | number>('one');
  const handleChange = (_ev: any, newSelectedTab: string | number) => setSelectedTab(newSelectedTab);
  return <Wrapper>
      <Typography component="span">Selected tab is {selectedTab}</Typography>

      <TabbedCard value={selectedTab} onChange={handleChange} title="Controlled Value Example">
        <CardTab value="one" label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab value="two" label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab value="three" label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab value="four" label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>;
}`,...c.parameters?.docs?.source}}};const we=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,c as WithControlledTabValue,p as WithFooterLink,we as __namedExportsOrder,Oe as default};
