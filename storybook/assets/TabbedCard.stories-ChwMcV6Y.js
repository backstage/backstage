import{j as e}from"./jsx-runtime-hv06LKfz.js";import{r as i}from"./index-D8-PC79C.js";import{m as f}from"./makeStyles-CJp8qHqH.js";import{C as O,a as w}from"./CardContent-BgHnYunW.js";import{E as W}from"./ErrorBoundary-CFaWvej5.js";import{w as L}from"./capitalize-fS9uM6tv.js";import{T as _,a as q}from"./Tabs-BzQqeg8O.js";import{D as H}from"./Divider-Gy4Ua46w.js";import{B as I}from"./BottomLink-CHNwKC1R.js";import{C as B}from"./CardHeader-BwM8TxO4.js";import{S}from"./Grid-8Ap4jsYG.js";import{T as M}from"./Typography-NhBf-tfS.js";import{M as P}from"./index-B7KODvs-.js";import"./defaultTheme-NkpNA350.js";import"./Paper-BiLxp0Cg.js";import"./translation-BlsjZX4-.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./ErrorPanel-BU6m2gEX.js";import"./WarningPanel-weqaMMm-.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./ExpandMore-BGg9E8oN.js";import"./AccordionDetails-Cg_0dnVS.js";import"./toArray-D29G-OqT.js";import"./index-DnL3XN75.js";import"./Collapse-NRZqYfCr.js";import"./utils-DMni-BWz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./useTheme-Dk0AiudM.js";import"./ButtonBase-DXo3xcpP.js";import"./IconButton-tgA3biVt.js";import"./MarkdownContent-BV0IOTxf.js";import"./index-BKN9BsH4.js";import"./CodeSnippet-BYf8ynTR.js";import"./iframe-B0lKZbgt.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-CG-FC_6P.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./CopyTextButton-CNtIvRbE.js";import"./useCopyToClipboard-Bz0ScI6A.js";import"./useMountedState-YD35FCBK.js";import"./Tooltip-fGAyvfC5.js";import"./Popper-ErueZYbr.js";import"./Portal-yuzZovYw.js";import"./Grow-BOepmPk1.js";import"./useTranslationRef-DKy5gnX5.js";import"./List-Bi5n8Alr.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-CIr9U5k9.js";import"./ListItemText-B_U2MM_y.js";import"./LinkButton-DYRmglqW.js";import"./Button-aFPoPc-s.js";import"./Link-m8k68nLc.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./useApp-BOX1l_wP.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./withStyles-BsQ9H3bp.js";import"./KeyboardArrowRight-DSUp4RBh.js";import"./ArrowForward-CE7WAE8k.js";const D=f(n=>({root:{padding:n.spacing(0,2,0,2.5),minHeight:n.spacing(3)},indicator:{backgroundColor:n.palette.info.main,height:n.spacing(.3)}}),{name:"BackstageTabbedCard"}),R=L(n=>({root:{padding:n.spacing(2,2,2,2.5),display:"inline-block"},title:{fontWeight:700},subheader:{paddingTop:n.spacing(1)}}),{name:"BackstageTabbedCardBoldHeader"})(B);function c(n){const{slackChannel:s,errorBoundaryProps:l,children:o,title:u,deepLink:y,value:b,onChange:v}=n,x=D(),[T,j]=i.useState(0),k=v||((a,C)=>j(C));let h;b?i.Children.map(o,a=>{i.isValidElement(a)&&a?.props.value===b&&(h=a?.props.children)}):i.Children.map(o,(a,C)=>{i.isValidElement(a)&&C===T&&(h=a?.props.children)});const E=l||(s?{slackChannel:s}:{});return e.jsx(O,{children:e.jsxs(W,{...E,children:[u&&e.jsx(R,{title:u}),e.jsx(_,{classes:x,value:b||T,onChange:k,children:o}),e.jsx(H,{}),e.jsx(w,{children:h}),y&&e.jsx(I,{...y})]})})}const V=f(n=>({root:{minWidth:n.spacing(6),minHeight:n.spacing(3),margin:n.spacing(0,2,0,0),padding:n.spacing(.5,0,.5,0),textTransform:"none","&:hover":{opacity:1,backgroundColor:"transparent",color:n.palette.text.primary}},selected:{fontWeight:n.typography.fontWeightBold}}),{name:"BackstageCardTab"});function r(n){const{children:s,...l}=n,o=V();return e.jsx(q,{disableRipple:!0,classes:o,...l})}c.__docgenInfo={description:"",methods:[],displayName:"TabbedCard",props:{slackChannel:{required:!1,tsType:{name:"string"},description:"@deprecated Use errorBoundaryProps instead"},errorBoundaryProps:{required:!1,tsType:{name:"PropsWithChildren",elements:[{name:"signature",type:"object",raw:`{
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

@public`,methods:[],displayName:"CardTab",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const t={height:200,width:500},g=({children:n})=>e.jsx(P,{children:n}),dn={title:"Layout/Tabbed Card",component:c,decorators:[n=>e.jsx(S,{container:!0,spacing:4,children:e.jsx(S,{item:!0,children:n()})})]},d=()=>e.jsx(g,{children:e.jsxs(c,{title:"Default Example Header",children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),N={title:"Go to XYZ Location",link:"#"},p=()=>e.jsx(g,{children:e.jsxs(c,{title:"Footer Link Example Header",deepLink:N,children:[e.jsx(r,{label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})}),m=()=>{const[n,s]=i.useState("one"),l=(o,u)=>s(u);return e.jsxs(g,{children:[e.jsxs(M,{component:"span",children:["Selected tab is ",n]}),e.jsxs(c,{value:n,onChange:l,title:"Controlled Value Example",children:[e.jsx(r,{value:"one",label:"Option 1",children:e.jsx("div",{style:t,children:"Some content"})}),e.jsx(r,{value:"two",label:"Option 2",children:e.jsx("div",{style:t,children:"Some content 2"})}),e.jsx(r,{value:"three",label:"Option 3",children:e.jsx("div",{style:t,children:"Some content 3"})}),e.jsx(r,{value:"four",label:"Option 4",children:e.jsx("div",{style:t,children:"Some content 4"})})]})]})};d.__docgenInfo={description:"",methods:[],displayName:"Default"};p.__docgenInfo={description:"",methods:[],displayName:"WithFooterLink"};m.__docgenInfo={description:"",methods:[],displayName:"WithControlledTabValue"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const pn=["Default","WithFooterLink","WithControlledTabValue"];export{d as Default,m as WithControlledTabValue,p as WithFooterLink,pn as __namedExportsOrder,dn as default};
