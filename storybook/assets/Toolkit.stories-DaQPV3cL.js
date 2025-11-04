import{j as o}from"./iframe-BFEEYdl1.js";import{c as e}from"./plugin-DKiRlTDL.js";import{S as l}from"./Grid-_pxMEZfk.js";import{C as m}from"./ComponentAccordion-OB8QYycT.js";import{w as a}from"./appWrappers-Drr8kDaZ.js";import{T as i}from"./TemplateBackstageLogoIcon-0rnfpHX6.js";import{I as s}from"./InfoCard-BJpJ1bY7.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-EFweYiy3.js";import"./componentData-fXGhNbVj.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./useRouteRef-Djz7qv6Y.js";import"./index-DFzOTOJF.js";import"./DialogTitle-C53FTZ8W.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./Backdrop-Cc0uQTMy.js";import"./Button-Ci5q7ey2.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./ExpandMore-Ctn3qfGH.js";import"./AccordionDetails-BWiYd2nY.js";import"./index-DnL3XN75.js";import"./Collapse-DQjjdB13.js";import"./useAsync-CK6ps4Gs.js";import"./useMountedState-SzYJvnyY.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C0IdQT8E.js";import"./ErrorBoundary-BrFvpfH8.js";import"./ErrorPanel-ByBjA_Oh.js";import"./WarningPanel-Ca_owezB.js";import"./MarkdownContent-BVMx6-i7.js";import"./CodeSnippet-DKeVSYKZ.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./CopyTextButton-CPUbqQk2.js";import"./useCopyToClipboard-CNm0_dns.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./ListItem-CoJRgtBh.js";import"./ListItemText-B34yPKAV.js";import"./LinkButton-CtAJOX-o.js";import"./Link-BzkurKFl.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-aKIXN66o.js";import"./Divider-CYSzQ_1E.js";import"./CardActions-BCgG5ICW.js";import"./BottomLink-Z_9FJnlR.js";import"./ArrowForward-CQW_bFSW.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
