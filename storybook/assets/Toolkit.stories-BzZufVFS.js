import{j as o}from"./iframe-CNJ8DcrC.js";import{c as e}from"./plugin-BPkq4E_8.js";import{S as l}from"./Grid-DnFVy6t2.js";import{C as m}from"./ComponentAccordion-D-DO7Sjh.js";import{w as a}from"./appWrappers-E57FXAeC.js";import{T as i}from"./TemplateBackstageLogoIcon-arEd5Nyt.js";import{I as s}from"./InfoCard-c8gqZTx-.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-_567Mtia.js";import"./componentData-D59WTCiB.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./useRouteRef-DK6B5L3X.js";import"./index-DkthXm2e.js";import"./DialogTitle-BtCIznAI.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./Backdrop-BXGq-7tC.js";import"./Button-BezvKFLQ.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./ExpandMore-P7Ms8H_E.js";import"./AccordionDetails-DFFwOrZV.js";import"./index-B9sM2jn7.js";import"./Collapse-CrkD-6-R.js";import"./useAsync-02suuxa3.js";import"./useMountedState-C-7cl-bH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C_MhXWNV.js";import"./ErrorBoundary-BHcUmZ0p.js";import"./ErrorPanel-Cfax6ZbZ.js";import"./WarningPanel-CAoaG3c4.js";import"./MarkdownContent-BzDAUZZf.js";import"./CodeSnippet-Cp3x4Ngz.js";import"./Box-CtI-kND1.js";import"./styled-CIO5_I8O.js";import"./CopyTextButton-C1aJOmrW.js";import"./useCopyToClipboard-CMtB8QI9.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./ListItem-31tIz_LL.js";import"./ListItemText-BjTS0dlF.js";import"./LinkButton-CdwWq3H_.js";import"./Link-UFLrOQPe.js";import"./lodash-Czox7iJy.js";import"./CardHeader-Croduw33.js";import"./Divider-BSUI1Y9r.js";import"./CardActions-D8qTLEGs.js";import"./BottomLink-iz8-XHvK.js";import"./ArrowForward-Xg3lDUK4.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
