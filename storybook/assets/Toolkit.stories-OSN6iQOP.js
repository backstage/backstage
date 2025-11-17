import{j as o}from"./iframe-CIM5duhm.js";import{c as e}from"./plugin-D9ar44j_.js";import{S as l}from"./Grid-Duc3jmgA.js";import{C as m}from"./ComponentAccordion-SuUtrehr.js";import{w as a}from"./appWrappers-C9XZWfKp.js";import{T as i}from"./TemplateBackstageLogoIcon-BVfBqTeq.js";import{I as s}from"./InfoCard-DYfoP3uw.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BahgJ1_U.js";import"./componentData-CysmgvuR.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./useRouteRef-BRIN7ftV.js";import"./index-eXSQF74E.js";import"./DialogTitle-C7x4V4Yo.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./Backdrop-ktCLmDIR.js";import"./Button-qnzTC3D6.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./ExpandMore-D2DOioK9.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Y_6Qe422.js";import"./ErrorBoundary-DW2AFmmD.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./CopyTextButton-DEGdjETq.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./ListItem-C8QkAD_t.js";import"./ListItemText-BZPfuyb-.js";import"./LinkButton-c10FrtBS.js";import"./Link-DCWBCw0R.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-AaChVV2H.js";import"./Divider-DA-kCS2y.js";import"./CardActions-LQToxJMs.js";import"./BottomLink-B0RwdjBb.js";import"./ArrowForward-Di3FBZA_.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
