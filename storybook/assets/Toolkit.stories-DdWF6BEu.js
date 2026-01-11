import{j as o}from"./iframe-C0ztlCqi.js";import{c as e}from"./plugin-D6qSC-Pj.js";import{S as l}from"./Grid-BJIH9AcQ.js";import{C as m}from"./ComponentAccordion-BLTBqXI3.js";import{w as a}from"./appWrappers-SwbnenOq.js";import{T as i}from"./TemplateBackstageLogoIcon-q_5ih5Pb.js";import{I as s}from"./InfoCard-B_00yS8h.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C7koouQA.js";import"./componentData-CW45w-aT.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./useRouteRef-B0OGFprJ.js";import"./index-BSDdaq1o.js";import"./DialogTitle-BqVBbkwh.js";import"./Modal-iwdO8Psb.js";import"./Portal-DgY2uLlM.js";import"./Backdrop-B-rl279U.js";import"./Button-CoF0Xodx.js";import"./useObservable-bc9p5D-G.js";import"./useIsomorphicLayoutEffect-HC7ppjUM.js";import"./ExpandMore-DjatSCT2.js";import"./AccordionDetails-Qdo8hGCI.js";import"./index-B9sM2jn7.js";import"./Collapse-BOuwDmTN.js";import"./useAsync-BkXPEwdl.js";import"./useMountedState-CWuBAMfh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BIqibGTm.js";import"./ErrorBoundary-B8VGBRFr.js";import"./ErrorPanel-BYV5vIqY.js";import"./WarningPanel-DIeTt0sm.js";import"./MarkdownContent-B6mn0xbm.js";import"./CodeSnippet-B5tPiRbT.js";import"./Box-CzQDPnzy.js";import"./styled-CWdZ-Z1U.js";import"./CopyTextButton-CR_eNMPC.js";import"./useCopyToClipboard-Cj1xpuKu.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./ListItem-BjSKqJNR.js";import"./ListItemText-C6kGUtI_.js";import"./LinkButton-Ce6yUEJH.js";import"./Link-BUMam9f4.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-ComZ7hKq.js";import"./Divider-CQWOB-Qy.js";import"./CardActions-CviPlupu.js";import"./BottomLink-C1LO4qL8.js";import"./ArrowForward-CZyq4r4K.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
