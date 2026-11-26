import{r as i,j as e,w as O,I as w}from"./iframe-CR1Jw9dV.js";import{C as L,a as W}from"./CardContent-MPhZHP_d.js";import{E as I}from"./ErrorBoundary-BwM5U5WZ.js";import{T as _,a as q}from"./Tabs-DcVc2eoa.js";import{D as B}from"./Divider-Dk_1lvZ6.js";import{B as H}from"./BottomLink-BN7eSHdl.js";import{m as S}from"./makeStyles-Blkp-8Vz.js";import{C as P}from"./CardHeader-BY0uCOEp.js";import{S as f}from"./Grid-CxkI-J4A.js";import{M}from"./index-BBOHwEhV.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Cy-zVRNg.js";import"./WarningPanel-Ch8DVuko.js";import"./ExpandMore-BPH7-hk8.js";import"./AccordionDetails-lcit3sf6.js";import"./index-B9sM2jn7.js";import"./Collapse-CNfkhbFo.js";import"./MarkdownContent-BnmsOE6s.js";import"./List-DygGvees.js";import"./ListContext-C50iGKA5.js";import"./ListItem-C8ehtjyx.js";import"./ListItemText-PI8GFBOf.js";import"./CopyTextButton-DPmLXo4_.js";import"./useCopyToClipboard-RvuO4m91.js";import"./useMountedState-Dyynv26Z.js";import"./Tooltip-Cf2zXoVS.js";import"./useObjectRef-CxAJnmky.js";import"./useOverlayTriggerState-BrayxibY.js";import"./utils-f1XPU8sj.js";import"./useFocusRing-CCR0Dk_B.js";import"./number-CXcznxJS.js";import"./I18nProvider-CXlyEy0i.js";import"./useControlledState-BQLBMnzZ.js";import"./animation-reWawdWv.js";import"./useHover-COtbARlD.js";import"./ButtonIcon-B6UbfbyX.js";import"./Button-DzhTBfgP.js";import"./Label-C37_b03j.js";import"./Hidden-B3uAAl_R.js";import"./useLabel-B8RNTxDr.js";import"./useLabels-C65kEDvg.js";import"./useButton-HAI6nP2s.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./getMetaValue-QyE7lEVK.js";import"./index-CHKdAyZ9.js";import"./LinkButton-CujRUvF1.js";import"./Link-Dhqz-BCc.js";import"./index-CuqShzUV.js";import"./lodash-5fYZTyfB.js";import"./useApp-D4i_SxIG.js";import"./useAnalytics-iih8YEd4.js";import"./Button-BWTngMKp.js";import"./KeyboardArrowRight-BAHt4XMA.js";import"./ArrowForward-Wuy3-8DN.js";import"./Box-BaA-dv-7.js";import"./styled-BINEkVaE.js";const D=S(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(P);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:T}=n,x=D(),[v,j]=i.useState(0),k=T||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===v&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(I,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(_,{classes:x,value:b||v,onChange:k,children:o}),e.jsx(B,{}),e.jsx(W,{children:h}),y&&e.jsx(H,{...y})]})})}const V=S(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function t(n){const{children:s,...l}=n,o=V();return e.jsx(q,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"@deprecated Compose `Card`, `CardHeader`, `CardBody`, `Tabs`, `TabList`,\n`Tab`, and `TabPanel` from `@backstage/ui` instead. Adapt selection to\ntab keys and `onSelectionChange`, and use `CardFooter` with a link for\n`deepLink`. Keep an error boundary around the content if you rely on this\ncomponent's error handling; BUI Card and Tabs do not provide it.",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"link",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLAnchorElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEvent<HTMLAnchorElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}},description:""}}};t.__docgenInfo={description:"Card tab component used in {@link TabbedCard}\n\n@public\n\n@deprecated Use `Tab` and `TabPanel` from `@backstage/ui` within a BUI\n`Tabs` and `TabList` composition. Give matching tabs and panels the same\n`id` and move tab content into `TabPanel`.",methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const r={height:200,width:500},g=({children:n})=>e.jsx(M,{children:n}),Ge={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(f,{container:!0,spacing:4,children:e.jsx(f,{item:!0,children:n()})})],tags:["!manifest"]},d=()=>e.jsx(g,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),A={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:A,children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),c=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(w,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(t,{value:"one",label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{value:"two",label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{value:"three",label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{value:"four",label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};c.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};const Ke=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,c as WithControlledTabValue,p as WithFooterLink,Ke as __namedExportsOrder,Ge as default};
