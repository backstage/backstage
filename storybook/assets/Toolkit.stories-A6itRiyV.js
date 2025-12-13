import{j as o}from"./iframe-DDGN0cGv.js";import{c as e}from"./plugin-DVGBlnIw.js";import{S as l}from"./Grid-D5cwdvdp.js";import{C as m}from"./ComponentAccordion-DsWQy80V.js";import{w as a}from"./appWrappers-C8vp-7ey.js";import{T as i}from"./TemplateBackstageLogoIcon-CrliIgwa.js";import{I as s}from"./InfoCard-_Sz2aZkG.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CBvsz8vm.js";import"./componentData-lXmOowuG.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./useRouteRef-6TTRl5Mq.js";import"./index-DCDfH_Li.js";import"./DialogTitle-CZfoj8Tu.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./Backdrop-0jy0HFas.js";import"./Button-BfPTYQOm.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./ExpandMore-DdbG_Iny.js";import"./AccordionDetails-D8hpySZx.js";import"./index-B9sM2jn7.js";import"./Collapse-1BtLbcFp.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D6aqZ2EH.js";import"./ErrorBoundary-LiF7Clop.js";import"./ErrorPanel-sm5fOIxM.js";import"./WarningPanel-BvxUrI8I.js";import"./MarkdownContent-D_mSSllG.js";import"./CodeSnippet-DUu5zKgy.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./CopyTextButton-K6z11-1u.js";import"./useCopyToClipboard-BVpL61aI.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./ListItem-B4p-bJZY.js";import"./ListItemText-D6aBcig9.js";import"./LinkButton-Dund-JVG.js";import"./Link-UwAe9NOh.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-tCD53RXU.js";import"./Divider-nJoj97pl.js";import"./CardActions-CHc_Iyiq.js";import"./BottomLink-DHFnJkTT.js";import"./ArrowForward-KHx9CCNT.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
