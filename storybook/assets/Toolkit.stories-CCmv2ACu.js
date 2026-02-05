import{j as o}from"./iframe-DVtcQ4_z.js";import{c as e}from"./plugin-Dz8jVe6c.js";import{S as l}from"./Grid-CRH4wMFl.js";import{C as m}from"./ComponentAccordion-yB2zcuTg.js";import{w as a}from"./appWrappers-9shJdU2k.js";import{T as i}from"./TemplateBackstageLogoIcon-HDtyy6CY.js";import{I as s}from"./InfoCard-lskUPJjc.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BFejrjRb.js";import"./componentData-DLUR4SEc.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./useRouteRef-CmZgmteL.js";import"./index-nBdCQRka.js";import"./DialogTitle-DWxUih24.js";import"./Modal-C3aeePrL.js";import"./Portal-kTp41skA.js";import"./Backdrop-BrMkINGu.js";import"./Button-B6Zk0t0c.js";import"./useObservable-B_06OWLq.js";import"./useIsomorphicLayoutEffect-DivdhHMv.js";import"./ExpandMore-BZTl6lHp.js";import"./AccordionDetails-20s0m78U.js";import"./index-B9sM2jn7.js";import"./Collapse-BTPpLLfL.js";import"./useAsync-0ylosLEO.js";import"./useMountedState-rAyQYyeH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CiVhExeM.js";import"./ErrorBoundary-DlSuROHw.js";import"./ErrorPanel-BTyMCoIE.js";import"./WarningPanel-DWnW9ndp.js";import"./MarkdownContent-C-D6oakD.js";import"./CodeSnippet-CJietKeS.js";import"./Box-D_1MPpAq.js";import"./styled-2Y3L2rTs.js";import"./CopyTextButton-DhwWsCh2.js";import"./useCopyToClipboard-ImQlBzLn.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./ListItem-C0fXON46.js";import"./ListItemText-CpGTJDVb.js";import"./LinkButton-6srsW-_l.js";import"./Link-t6CnRMqh.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DLPiWAMi.js";import"./Divider-BmAsVb_O.js";import"./CardActions-DNd32Pjk.js";import"./BottomLink-zMVcDBLB.js";import"./ArrowForward-C8LFtIoy.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
