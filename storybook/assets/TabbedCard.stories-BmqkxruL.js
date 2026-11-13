import{r as i,j as e,w as O,I as w}from"./iframe-jnmYTFb3.js";import{C as L,a as W}from"./CardContent-BpNOkdyP.js";import{E as I}from"./ErrorBoundary-B2DaKNiV.js";import{T as _,a as q}from"./Tabs-CtJ3Lfyb.js";import{D as B}from"./Divider-Cc2XeNV9.js";import{B as H}from"./BottomLink-D9_78dwf.js";import{m as S}from"./makeStyles-BpJnXHFG.js";import{C as P}from"./CardHeader-C98tvif3.js";import{S as f}from"./Grid-DHhCW-Yl.js";import{M}from"./index-C7-0R-zP.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-B_TITbIF.js";import"./WarningPanel-Dg3CiKPr.js";import"./ExpandMore-CA8sV17M.js";import"./AccordionDetails-Cr-qO6HI.js";import"./index-B9sM2jn7.js";import"./Collapse-DTDzxOj5.js";import"./MarkdownContent-DJmkymU6.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./ListItem-BO9RXUpG.js";import"./ListItemText-BnRAJA86.js";import"./CopyTextButton-gYqzu9p-.js";import"./useCopyToClipboard-Dr9NpXhu.js";import"./useMountedState-zcJIkXnT.js";import"./Tooltip-B1tKDHkx.js";import"./useObjectRef-FWUTxVt4.js";import"./useOverlayTriggerState-B51CCYAg.js";import"./utils-CKg7Fv9H.js";import"./useFocusRing-BdOMpJmy.js";import"./number-C6hsbYZL.js";import"./I18nProvider-CZql2cBv.js";import"./useControlledState-CrGsVDTu.js";import"./animation-CVivYYSw.js";import"./useHover-uknbF-p6.js";import"./ButtonIcon-sVT7F_2-.js";import"./Button-DgXb-SRY.js";import"./Label-B1pLoO_3.js";import"./Hidden-xHEnn_eG.js";import"./useLabel-0FUhOvtV.js";import"./useLabels-BVz1Fy9t.js";import"./useButton-CukdYqmR.js";import"./usePress-0a27YkJt.js";import"./textSelection-BFpEW1JG.js";import"./getMetaValue-vz9tQ4MU.js";import"./index-C6hgsZfa.js";import"./LinkButton-C3rzieqs.js";import"./Link-DMTmhcL8.js";import"./index-CdOJX-9o.js";import"./lodash-DMwpKwqE.js";import"./useApp-BB1JgkaP.js";import"./useAnalytics-BuCMBFsG.js";import"./Button-B0YoQGzG.js";import"./KeyboardArrowRight-DDsdqCIf.js";import"./ArrowForward-DgidlQv-.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";const D=S(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(P);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:T}=n,x=D(),[v,j]=i.useState(0),k=T||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===v&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(I,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(_,{classes:x,value:b||v,onChange:k,children:o}),e.jsx(B,{}),e.jsx(W,{children:h}),y&&e.jsx(H,{...y})]})})}const V=S(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function t(n){const{children:s,...l}=n,o=V();return e.jsx(q,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"@deprecated Compose `Card`, `CardHeader`, `CardBody`, `Tabs`, `TabList`,\n`Tab`, and `TabPanel` from `@backstage/ui` instead. Adapt selection to\ntab keys and `onSelectionChange`, and use `CardFooter` with a link for\n`deepLink`. Keep an error boundary around the content if you rely on this\ncomponent's error handling; BUI Card and Tabs do not provide it.",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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
