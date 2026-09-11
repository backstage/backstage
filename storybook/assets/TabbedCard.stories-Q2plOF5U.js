import{c8 as i,bQ as e,cY as O,a9 as w,w as W}from"./iframe-DgMUslzK.js";import{C as L,a as _}from"./CardContent-CDtX70Zb.js";import{E as q}from"./ErrorBoundary-BbyFu1wJ.js";import{b as H,T as I}from"./Tabs-Cd1y7UJW.js";import{D as B}from"./Divider-DGLYC4n9.js";import{B as P}from"./BottomLink-CY6BX_Aw.js";import{m as x}from"./makeStyles-Df7PmhVI.js";import{C as M}from"./CardHeader-yuQztdzz.js";import{S}from"./Grid-aIkVCW8j.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CG7MoIKd.js";import"./WarningPanel-DwBSOHRq.js";import"./ExpandMore-BUQTRYwG.js";import"./AccordionDetails-CGc0qdC8.js";import"./index-B9sM2jn7.js";import"./Collapse-BP8K-4gs.js";import"./MarkdownContent-CXy7dU3f.js";import"./Link-COy2ek7E.js";import"./index-CvMNCDS_.js";import"./lodash-C5szjeEy.js";import"./useAnalytics-BFdM291c.js";import"./useApp-KaRpWMSR.js";import"./CodeSnippet-IpMZSFLD.js";import"./List-C-zQfqUQ.js";import"./ListContext-hXedtGND.js";import"./ListItem-Bc79FKQe.js";import"./ListItemText-Bbi0SDLM.js";import"./CopyTextButton-CFPN3wxG.js";import"./useCopyToClipboard-Bbf4P5Ai.js";import"./useMountedState-C1sLF66g.js";import"./Tooltip-BLYW7H2X.js";import"./useObjectRef-XeGD6VQX.js";import"./useOverlayTriggerState-BQASwI2b.js";import"./utils-DhxbSGHl.js";import"./useFocusRing-B4qSrPyS.js";import"./openLink-CV_TcEkD.js";import"./number-BYuAoFwI.js";import"./I18nProvider-CGCG23Ya.js";import"./useControlledState-BXceL1Ef.js";import"./animation-CkKjJK8U.js";import"./useHover-D4699e1A.js";import"./ButtonIcon-CQGcwODg.js";import"./Button-Ce1GzKNk.js";import"./Label-RJPM6nLR.js";import"./Hidden-BAVkFQWw.js";import"./useLabel-Cp4A-_gp.js";import"./useLabels-B0EqUNWZ.js";import"./useButton-DTMzfS5e.js";import"./usePress-CnualNnF.js";import"./textSelection-XO3NdvnZ.js";import"./index-CQmiOcmz.js";import"./LinkButton-DrCyPL9q.js";import"./Button-3kKv2_eC.js";import"./KeyboardArrowRight-BGQq61xN.js";import"./ArrowForward-BgNJuNWP.js";import"./Box-BJxowxBS.js";import"./styled-BfrhGEg9.js";const D=x(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(M);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:v}=n,f=D(),[T,j]=i.useState(0),k=v||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===T&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(q,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(H,{classes:f,value:b||T,onChange:k,children:o}),e.jsx(B,{}),e.jsx(_,{children:h}),y&&e.jsx(P,{...y})]})})}const V=x(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function r(n){const{children:s,...l}=n,o=V();return e.jsx(I,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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

@public`,methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const t={height:200,width:500},g=({children:n})=>e.jsx(W,{children:n}),Ye={title:"Layout/Tabbed Card",component:m,decorators:[n=>e.jsx(S,{container:!0,spacing:4,children:e.jsx(S,{item:!0,children:n()})})],tags:["!manifest"]},d=()=>e.jsx(g,{children:e.jsxs(m,{title:"Default Example Header",children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),N={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(m,{title:"Footer Link Example Header",deepLink:N,children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),c=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(w,{component:"span",children:["Selected tab is ",n]}),e.jsxs(m,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(r,{value:"one",label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{value:"two",label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{value:"three",label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{value:"four",label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};c.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};const Qe=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,c as WithControlledTabValue,p as WithFooterLink,Qe as __namedExportsOrder,Ye as default};
