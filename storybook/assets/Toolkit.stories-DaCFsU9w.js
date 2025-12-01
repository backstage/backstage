import{j as o}from"./iframe-B07WZXM3.js";import{c as e}from"./plugin-Cky38OIy.js";import{S as l}from"./Grid-BY5Lob_Q.js";import{C as m}from"./ComponentAccordion-C1xSnR-e.js";import{w as a}from"./appWrappers-CY9OeE-D.js";import{T as i}from"./TemplateBackstageLogoIcon-SH_dYuY-.js";import{I as s}from"./InfoCard-F0p-l5uK.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CZOVJjYF.js";import"./componentData-DQzB6vVe.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./useRouteRef-YqSqr-8_.js";import"./index-BxkUEN8z.js";import"./DialogTitle-D75WnviF.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./Backdrop-BhjMJ7cT.js";import"./Button-CyuaBLDC.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./ExpandMore-Da5XW09b.js";import"./AccordionDetails-B-vBZmTY.js";import"./index-DnL3XN75.js";import"./Collapse-Bc-VFX1u.js";import"./useAsync-DCstABRD.js";import"./useMountedState-BHHklG7n.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Di1P8Mmg.js";import"./ErrorBoundary-C0cY3uRo.js";import"./ErrorPanel-ayETAGhj.js";import"./WarningPanel-DImNnyuV.js";import"./MarkdownContent-CcNYv7l1.js";import"./CodeSnippet-BxcFip7J.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./CopyTextButton-xE5t_wDk.js";import"./useCopyToClipboard-2MhLRliJ.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./ListItem-CbK_QR24.js";import"./ListItemText-BnYxYQrd.js";import"./LinkButton-C9NGk5Cj.js";import"./Link-BSdi_-Cv.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-D4MCyAu5.js";import"./Divider-MyjmiSrT.js";import"./CardActions-DK9Pnp_M.js";import"./BottomLink-DRJDK7sA.js";import"./ArrowForward-C1CbMcYH.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
