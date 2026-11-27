import{r as i,j as e,w as O,I as w}from"./iframe-BLrGTSaW.js";import{C as L,a as W}from"./CardContent-SuRFy6QZ.js";import{E as I}from"./ErrorBoundary-b1SGZm1v.js";import{T as _,a as q}from"./Tabs-CRCz64sF.js";import{D as B}from"./Divider-Bz-KunCn.js";import{B as H}from"./BottomLink-BTcY1Ger.js";import{m as S}from"./makeStyles-vgIFYWcM.js";import{C as P}from"./CardHeader-CH7M_pyb.js";import{S as f}from"./Grid-njQ-TjUb.js";import{M}from"./index-CAEKkElr.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-COGKSxFN.js";import"./WarningPanel-DMN2jsxP.js";import"./ExpandMore-BuGI4WBo.js";import"./AccordionDetails-C8i5_inN.js";import"./index-B9sM2jn7.js";import"./Collapse-8iH-yJHO.js";import"./MarkdownContent-DWhqPdba.js";import"./List-DXjprzcI.js";import"./ListContext-zWPrJgIH.js";import"./ListItem-CqPT8Adv.js";import"./ListItemText-Bdj1tlwf.js";import"./CopyTextButton-CFLvRCX8.js";import"./useCopyToClipboard-Dwyq30yz.js";import"./useMountedState-DtifuCZ1.js";import"./Tooltip-guwHEmuy.js";import"./useObjectRef-ZSOSKmjG.js";import"./useOverlayTriggerState-BbSgKNtq.js";import"./utils-DY5RBqiV.js";import"./useFocusRing-BB9hpzXx.js";import"./number-y3IrGTZu.js";import"./I18nProvider-q6Gkr_5S.js";import"./useControlledState-DB6Fhmvl.js";import"./useTooltipTriggerState-CzFxnGQ-.js";import"./animation-BTuqI_dB.js";import"./useHover-SA74TXF1.js";import"./ButtonIcon-KOwfGuV9.js";import"./Button-DRJWcbqL.js";import"./Label-CubIRV2P.js";import"./Hidden-mL7bCk3G.js";import"./useLabel-CLI3Xr7r.js";import"./useLabels-CSSt0rmf.js";import"./useButton-DzeSStJg.js";import"./usePress-DBe51dZ5.js";import"./textSelection-DRK0jW1V.js";import"./getMetaValue-CAHBYg8p.js";import"./index-Csl_cXug.js";import"./LinkButton-BDZUrC6D.js";import"./Link-Lv4PpJLO.js";import"./index-Dp1J5c3v.js";import"./lodash-DzUEr9HT.js";import"./useApp-CYEN5pYN.js";import"./useAnalytics-BEvcg19j.js";import"./Button-BQ8DTl7J.js";import"./KeyboardArrowRight-Drr403HH.js";import"./ArrowForward-BRjD1hq6.js";import"./Box-Dre9Kf-d.js";import"./styled-C9flu1SF.js";const D=S(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(P);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:T}=n,x=D(),[v,j]=i.useState(0),k=T||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===v&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(I,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(_,{classes:x,value:b||v,onChange:k,children:o}),e.jsx(B,{}),e.jsx(W,{children:h}),y&&e.jsx(H,{...y})]})})}const V=S(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function t(n){const{children:s,...l}=n,o=V();return e.jsx(q,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"@deprecated Compose `Card`, `CardHeader`, `CardBody`, `Tabs`, `TabList`,\n`Tab`, and `TabPanel` from `@backstage/ui` instead. Adapt selection to\ntab keys and `onSelectionChange`, and use `CardFooter` with a link for\n`deepLink`. Keep an error boundary around the content if you rely on this\ncomponent's error handling; BUI Card and Tabs do not provide it.",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"link",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLAnchorElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLAnchorElement"}],raw:"MouseEvent<HTMLAnchorElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}},description:""}}};t.__docgenInfo={description:"Card tab component used in {@link TabbedCard}\n\n@public\n\n@deprecated Use `Tab` and `TabPanel` from `@backstage/ui` within a BUI\n`Tabs` and `TabList` composition. Give matching tabs and panels the same\n`id` and move tab content into `TabPanel`.",methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const r={height:200,width:500},g=({children:n})=>e.jsx(M,{children:n}),Ke={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(f,{container:!0,spacing:4,children:e.jsx(f,{item:!0,children:n()})})],tags:["!manifest"]},d=()=>e.jsx(g,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),A={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:A,children:[e.jsx(t,{label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})}),c=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(w,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(t,{value:"one",label:"Option 1",children:e.jsx("div",{style:r,children:"Some content"})}),e.jsx(t,{value:"two",label:"Option 2",children:e.jsx("div",{style:r,children:"Some content 2"})}),e.jsx(t,{value:"three",label:"Option 3",children:e.jsx("div",{style:r,children:"Some content 3"})}),e.jsx(t,{value:"four",label:"Option 4",children:e.jsx("div",{style:r,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};c.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};const Xe=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,c as WithControlledTabValue,p as WithFooterLink,Xe as __namedExportsOrder,Ke as default};
