import{r as i,j as e,w as O,Q as w,M as W}from"./iframe-CSz7VfT3.js";import{C as L,a as _}from"./CardContent-C8xt9NWc.js";import{E as q}from"./ErrorBoundary-C019G94d.js";import{T as H,a as I}from"./Tabs-CaGcQ0C0.js";import{D as B}from"./Divider-C-NbBHFJ.js";import{B as M}from"./BottomLink-B5eiK18o.js";import{m as x}from"./makeStyles-CC8EE5Qs.js";import{C as P}from"./CardHeader-Cn_9W9w3.js";import{S}from"./Grid-BK-uRE6j.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-8woJBBMq.js";import"./WarningPanel-BTvS4Kpf.js";import"./ExpandMore-CT8H60wv.js";import"./AccordionDetails-DXova11v.js";import"./index-B9sM2jn7.js";import"./Collapse-B_-gM8xf.js";import"./MarkdownContent-CUw9F_Zb.js";import"./Link-Df0pdh_K.js";import"./index-CZ0nvQAS.js";import"./lodash-KZId8LWf.js";import"./useAnalytics-CbLpUIzI.js";import"./useApp-BQDc9GUX.js";import"./CodeSnippet-Ct0SFSP9.js";import"./List-BSep9TdZ.js";import"./ListContext-PRAg6M82.js";import"./ListItem-CIKs1J7B.js";import"./ListItemText-Dii_m3Om.js";import"./CopyTextButton-CvJJcSKj.js";import"./useCopyToClipboard-CgUWd10c.js";import"./useMountedState-Bb4Yyk9k.js";import"./Tooltip-B6cAtNwx.js";import"./useObjectRef-D_q6rl-C.js";import"./useOverlayTriggerState-BU4FYN95.js";import"./utils-DO510V5r.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./number-vPK-eftY.js";import"./I18nProvider-C8LosUml.js";import"./useControlledState-D9BG_cB_.js";import"./animation-CNMihT0b.js";import"./useHover-C4tPk2eu.js";import"./ButtonIcon-C7S555RE.js";import"./Button-Be0Cy88V.js";import"./Label-AZq59z2_.js";import"./Hidden-CM7FbOlL.js";import"./useLabel-B7GfVGDS.js";import"./useLabels-53H5tn1J.js";import"./useButton-0UwCDxtn.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./getMetaValue-C_A1bvat.js";import"./index-ndNk04vF.js";import"./LinkButton-bFdyyEtx.js";import"./Button-BYQLCTm-.js";import"./KeyboardArrowRight-BgTWG4ng.js";import"./ArrowForward-DumSHRYZ.js";import"./Box-Bz86QYYh.js";import"./styled-BZdOrxc2.js";const D=x(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=O(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(P);function m(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:v}=n,f=D(),[T,j]=i.useState(0),k=v||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===T&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(L,{children:e.jsxs(q,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(H,{classes:f,value:b||T,onChange:k,children:o}),e.jsx(B,{}),e.jsx(_,{children:h}),y&&e.jsx(M,{...y})]})})}const V=x(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function r(n){const{children:s,...l}=n,o=V();return e.jsx(I,{disableRipple:!0,classes:o,...l})}m.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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
