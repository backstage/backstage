import{j as o}from"./iframe-DgkzaRcz.js";import{c as e}from"./plugin-KjjyD6lr.js";import{S as l}from"./Grid-13HvIHxd.js";import{C as m}from"./ComponentAccordion-DPfBCY0g.js";import{w as a}from"./appWrappers-BBkmPso_.js";import{T as i}from"./TemplateBackstageLogoIcon-Cxo_63bA.js";import{I as s}from"./InfoCard-DroCXsE2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Dd63G45J.js";import"./componentData-D6jwBdZo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./useRouteRef-CgaN9BS2.js";import"./index-BovWTFKo.js";import"./DialogTitle-CLNs8i90.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./Backdrop-Do9s46dm.js";import"./Button-DputNV-f.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./index-B9sM2jn7.js";import"./Collapse-zjOOSLQm.js";import"./useAsync-B6sI7pgh.js";import"./useMountedState-C4ChfPSk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BEcXzYfT.js";import"./ErrorBoundary-BMyytlZG.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./ListItemText-BTjp8q3D.js";import"./LinkButton-Cj7uwqzc.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BIR3esA0.js";import"./Divider-BsgTAdRC.js";import"./CardActions-VTkMzbqT.js";import"./BottomLink-DudYzn0u.js";import"./ArrowForward-Df-EQyM5.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
