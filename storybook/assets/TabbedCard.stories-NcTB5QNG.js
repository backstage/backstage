import{r as i,j as e,w as O,Q as w,M as W}from"./iframe-BYYe_BET.js";import{C as L,a as _}from"./CardContent-D5nWOQeR.js";import{E as q}from"./ErrorBoundary-BLXqS4cb.js";import{T as H,a as I}from"./Tabs-DR3y5t9v.js";import{D as B}from"./Divider-pRXEZ2ju.js";import{B as M}from"./BottomLink-Cnc50wsC.js";import{m as x}from"./makeStyles-BqAzHYwu.js";import{C as P}from"./CardHeader-Dt_1A6RJ.js";import{S}from"./Grid-DwakReSX.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DpueJr42.js";import"./WarningPanel-Bw52NOZl.js";import"./ExpandMore-CiDqCMb1.js";import"./AccordionDetails-CS7mUXMa.js";import"./index-B9sM2jn7.js";import"./Collapse-dimKAT4N.js";import"./MarkdownContent-WNB-yFQn.js";import"./Link-DQQIOfhH.js";import"./index-C_fPlOPu.js";import"./lodash-lhI2pBpB.js";import"./useAnalytics-DWxEYXCC.js";import"./useApp-C6DR3uil.js";import"./CodeSnippet-CZ2XO4Zf.js";import"./List-DdhsJ4F5.js";import"./ListContext-DCNSGU5g.js";import"./ListItem-t-HbrJXm.js";import"./ListItemText-Y-vaEivY.js";import"./CopyTextButton-Cug5hb1r.js";import"./useCopyToClipboard-Cn49hS36.js";import"./useMountedState-BJL-WLRQ.js";import"./Tooltip-B3Py3aUh.js";import"./useObjectRef-9OXtpzcu.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./utils-CJSyyO3-.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./number-CtW1NSkQ.js";import"./I18nProvider-rRNMaJeu.js";import"./useControlledState-DguQehpe.js";import"./animation-DtpQ2ZDK.js";import"./useHover-DawSjhGk.js";import"./ButtonIcon-I4aSAKuo.js";import"./Button-DEPxcD8C.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./getMetaValue-Bn1etyTW.js";import"./index-COE7Jz9g.js";import"./LinkButton-eCo4PHSG.js";import"./Button-Cl-6XZWq.js";import"./KeyboardArrowRight-BzVnG_4m.js";import"./ArrowForward-7tI5ROL2.js";import"./Box-0Ecv0mGg.js";import"./styled-D32qgjdu.js";const D=x(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(P);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:v}=n,f=D(),[T,j]=i.useState(0),k=v||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===T&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(q,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(H,{classes:f,value:b||T,onChange:k,children:o}),e.jsx(B,{}),e.jsx(_,{children:h}),y&&e.jsx(M,{...y})]})})}const V=x(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function r(n){const{children:s,...l}=n,o=V();return e.jsx(I,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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

@public`,methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const t={height:200,width:500},g=({children:n})=>e.jsx(W,{children:n}),Ue={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(S,{container:!0,spacing:4,children:e.jsx(S,{item:!0,children:n()})})],tags:["!manifest"]},d=()=>e.jsx(g,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),N={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:N,children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),c=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(w,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(r,{value:"one",label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{value:"two",label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{value:"three",label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{value:"four",label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};c.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};const Xe=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,c as WithControlledTabValue,p as WithFooterLink,Xe as __namedExportsOrder,Ue as default};
