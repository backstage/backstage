import{m as x,r as d,j as e,w as O,e as W}from"./iframe-BMBKvx7J.js";import{C as w,a as L}from"./CardContent-BAt-txin.js";import{E as _}from"./ErrorBoundary-BQATzt5e.js";import{T as q,a as H}from"./Tabs-Cqthr7Ah.js";import{D as I}from"./Divider-ChrZ6SL1.js";import{B}from"./BottomLink-Dme4aBKb.js";import{C as M}from"./CardHeader-D5ilYYS_.js";import{S}from"./Grid-BeDT5Yac.js";import{M as P}from"./index-f5vhF8Nw.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-D5Anj456.js";import"./WarningPanel-BEJQshL2.js";import"./ExpandMore-sNERVSEz.js";import"./AccordionDetails-jHFZItW8.js";import"./index-B9sM2jn7.js";import"./Collapse-BfJEIrfz.js";import"./MarkdownContent-DooLYWBv.js";import"./CodeSnippet-WffvFiX0.js";import"./Box-DyedS4TQ.js";import"./styled-COJRzbtL.js";import"./CopyTextButton-BXHrVG_E.js";import"./useCopyToClipboard-DCvnibP8.js";import"./useMountedState-BBcU3kFA.js";import"./Tooltip-DXXVKXwk.js";import"./Popper-BvJ_4JLG.js";import"./Portal-B2w_zRgr.js";import"./List-BQBKpXrc.js";import"./ListContext-dtOkQmZD.js";import"./ListItem-CBHuw_mT.js";import"./ListItemText-DxMoHBvJ.js";import"./LinkButton-D0OIQBP6.js";import"./Link-CAECYSd6.js";import"./lodash-Czox7iJy.js";import"./useAnalytics-6fQpVHvB.js";import"./useApp-CHxPlzN3.js";import"./Button-CgZNjnDR.js";import"./KeyboardArrowRight-CENeANSn.js";import"./ArrowForward-C41XCtXB.js";const D=x(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),V=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(M);function m(n){const{slackChannel:c,errorBoundaryProps:p,children:s,title:b,deepLink:v,value:u,onChange:h}=n,f=D(),[g,j]=d.useState(0),k=h||((l,y)=>j(y));let C;u?d.Children.map(s,l=>{d.isValidElement(l)&&l?.props.value===u&&(C=l?.props.children)}):d.Children.map(s,(l,y)=>{d.isValidElement(l)&&y===g&&(C=l?.props.children)});const E=p||(c?{slackChannel:c}:{});return e.jsx(w,{children:e.jsxs(_,{...E,children:[b&&e.jsx(V,{title:b}),e.jsx(q,{classes:f,value:u||g,onChange:k,children:s}),e.jsx(I,{}),e.jsx(L,{children:C}),v&&e.jsx(B,{...v})]})})}const F=x(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function t(n){const{children:c,...p}=n,s=F();return e.jsx(H,{disableRipple:!0,classes:s,...p})}m.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"link",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLAnchorElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEvent<HTMLAnchorElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}},description:""}}};t.__docgenInfo={description:`Card tab component used in {@link TabbedCard}

@public`,methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const r={height:200,width:500},T=({children:n})=>e.jsx(P,{children:n}),Ee={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(S,{container:!0,spacing:4,children:e.jsx(S,{item:!0,children:n()})})],tags:["!manifest"]},a=()=>e.jsx(T,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),R={title:"Go to XYZ Location",link:"#"},o=()=>e.jsx(T,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:R,children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),i=()=>{const[n,c]=d.useState("one"),p=(s,b)=>c(b);return e.jsxs(T,{children:[e.jsxs(W,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:p,title:"Controlled Value Example",children:[e.jsx(t,{value:"one",label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{value:"two",label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{value:"three",label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{value:"four",label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})]})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};i.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const Default = () => {
  return (
    <Wrapper>
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
    </Wrapper>
  );
};
`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithFooterLink = () => {
  return (
    <Wrapper>
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
    </Wrapper>
  );
};
`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const WithControlledTabValue = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>("one");

  const handleChange = (_ev: any, newSelectedTab: string | number) =>
    setSelectedTab(newSelectedTab);

  return (
    <Wrapper>
      <Typography component="span">Selected tab is {selectedTab}</Typography>

      <TabbedCard
        value={selectedTab}
        onChange={handleChange}
        title="Controlled Value Example"
      >
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
    </Wrapper>
  );
};
`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const Oe=["Default","WithFooterLink","WithControlledTabValue"];export{a as Default,i as WithControlledTabValue,o as WithFooterLink,Oe as __namedExportsOrder,Ee as default};
