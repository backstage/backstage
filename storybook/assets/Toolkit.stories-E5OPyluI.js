import{j as o}from"./iframe-Dl820wOI.js";import{c as e}from"./plugin-BaRFzbFH.js";import{S as l}from"./Grid-BlSwvCAu.js";import{C as m}from"./ComponentAccordion-ClpPBFal.js";import{w as a}from"./appWrappers-BD3uh5nl.js";import{T as i}from"./TemplateBackstageLogoIcon-BO6av0Yb.js";import{I as s}from"./InfoCard-Bz2zmd-3.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-3vtTV61V.js";import"./componentData-9E7-GlxJ.js";import"./useAnalytics-H66oe0oN.js";import"./useApp-B5QaOHzA.js";import"./useRouteRef-C9mydBcp.js";import"./index-Dc9OD8OQ.js";import"./DialogTitle-CxtWIpkN.js";import"./Modal-DWfTsRMv.js";import"./Portal-jLwVh-5o.js";import"./Backdrop-BMrQTwpi.js";import"./Button-BNshOWAl.js";import"./useObservable-C0M1HCkm.js";import"./useIsomorphicLayoutEffect-BfWFNjzn.js";import"./ExpandMore-BlvUDGnA.js";import"./AccordionDetails-vMLxVx9E.js";import"./index-DnL3XN75.js";import"./Collapse-s2rcogEo.js";import"./useAsync-BnrwJMnZ.js";import"./useMountedState-C0tKh2p0.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BbppD0Sf.js";import"./ErrorBoundary-TU5r1TN3.js";import"./ErrorPanel-Bkv9ZIFz.js";import"./WarningPanel-CQQpX2Kh.js";import"./MarkdownContent-Cgb47FM9.js";import"./CodeSnippet-C8tyMWnK.js";import"./Box-DfeHQWeE.js";import"./styled-kfqHWboF.js";import"./CopyTextButton-Dfef_A-E.js";import"./useCopyToClipboard-y5aTqnvo.js";import"./Tooltip-DqMu2rNF.js";import"./Popper-CWjD6Kfi.js";import"./List-CHKnkhL9.js";import"./ListContext-Cbtrueie.js";import"./ListItem-Bj_ICtqE.js";import"./ListItemText-D5ck7_4o.js";import"./LinkButton-C-wRK3uh.js";import"./Link-BTOOY6TC.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DGlc83ja.js";import"./Divider-BgKPwKXb.js";import"./CardActions-DERKWDxO.js";import"./BottomLink-CrHLb6uy.js";import"./ArrowForward-Bcalu6Is.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
