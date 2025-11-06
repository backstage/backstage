import{j as o}from"./iframe-DKl1TaBY.js";import{c as e}from"./plugin-ofVW4ekV.js";import{S as l}from"./Grid-DucnE1Qv.js";import{C as m}from"./ComponentAccordion-AJ2HRPXK.js";import{w as a}from"./appWrappers-CQMFW9f8.js";import{T as i}from"./TemplateBackstageLogoIcon-D-WLwKOR.js";import{I as s}from"./InfoCard-BXfocUJP.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-Cp-tNdu1.js";import"./componentData-C9VKpHEQ.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./useRouteRef-CjGG19qw.js";import"./index-CAizWZSO.js";import"./DialogTitle-BfB3GFxp.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./Backdrop-C6FYe0Ep.js";import"./Button-ho9zTU_x.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./ExpandMore-SNT8Gr9W.js";import"./AccordionDetails-5IM8yJG8.js";import"./index-DnL3XN75.js";import"./Collapse-DRCUh2Je.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BnHsAJ1f.js";import"./ErrorBoundary-pwMpy8Pl.js";import"./ErrorPanel-9AkQroOm.js";import"./WarningPanel-eVG4_neK.js";import"./MarkdownContent-Cd_tUbb9.js";import"./CodeSnippet-CNnnJvIp.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./CopyTextButton-TfPCFLIm.js";import"./useCopyToClipboard-BgwPpn9s.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./ListItem-Cik-ImzB.js";import"./ListItemText-X8gsxozg.js";import"./LinkButton-Bm5eURQl.js";import"./Link-BtYWFjac.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CZMAOeHX.js";import"./Divider-DdBr9tFd.js";import"./CardActions-BFLytzP8.js";import"./BottomLink-BpjWpCp6.js";import"./ArrowForward-DvHRQMuG.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
