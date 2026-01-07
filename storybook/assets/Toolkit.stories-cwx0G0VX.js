import{j as o}from"./iframe-BY6cr4Gs.js";import{c as e}from"./plugin-D9w6b_6Z.js";import{S as l}from"./Grid-CPNST6ei.js";import{C as m}from"./ComponentAccordion-yQtAhF3q.js";import{w as a}from"./appWrappers-Pq-5KpLz.js";import{T as i}from"./TemplateBackstageLogoIcon-wbI0na4d.js";import{I as s}from"./InfoCard-BuJiqpT7.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-1eY0U0Da.js";import"./componentData-DkH1zoGD.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./useRouteRef-CBJLvC2e.js";import"./index-CidjncPb.js";import"./DialogTitle-CbbvyQ_k.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./Backdrop-BfxA9Fnq.js";import"./Button-BcV-aad6.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./ExpandMore-3nEtbL-z.js";import"./AccordionDetails-B6u38Rkn.js";import"./index-B9sM2jn7.js";import"./Collapse-hpYL9C9B.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-JC9uGNq1.js";import"./ErrorBoundary-hvzZq_Hc.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./CopyTextButton-CGe-CNwz.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./ListItemText-DmFJDJ0x.js";import"./LinkButton-ByF38BEu.js";import"./Link-Y-vtcYZ5.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-C1KSGg0j.js";import"./Divider-0kZVZRxa.js";import"./CardActions-wlHMcfv2.js";import"./BottomLink-4rbJl6ej.js";import"./ArrowForward-C-vHhjk_.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
