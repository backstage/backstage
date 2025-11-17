import{j as o}from"./iframe-DQwDoo1H.js";import{c as e}from"./plugin-dmErilqI.js";import{S as l}from"./Grid-C1mkfO-A.js";import{C as m}from"./ComponentAccordion-CG6rggRD.js";import{w as a}from"./appWrappers-DVOHFJoQ.js";import{T as i}from"./TemplateBackstageLogoIcon-aWtWYBTO.js";import{I as s}from"./InfoCard-BtXgYcU_.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CD-n_nwk.js";import"./componentData-CtVPpLvp.js";import"./useAnalytics-CM26OCnx.js";import"./useApp-DwlOIlXY.js";import"./useRouteRef-ygb9ecnn.js";import"./index-HojQYYpO.js";import"./DialogTitle-BfXc2ZX9.js";import"./Modal-BBquywqf.js";import"./Portal-0E-kgImq.js";import"./Backdrop-BnvfdWzz.js";import"./Button-DxB0Mkn2.js";import"./useObservable-BprdzNtB.js";import"./useIsomorphicLayoutEffect-DKvvtE9T.js";import"./ExpandMore-fAUa6rkR.js";import"./AccordionDetails-DSyZkU1w.js";import"./index-DnL3XN75.js";import"./Collapse-BgsL6NY8.js";import"./useAsync-NIOp2rsC.js";import"./useMountedState-nYgtVuR7.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BD09Z7SB.js";import"./ErrorBoundary-m70byrMj.js";import"./ErrorPanel-BmTSQtWv.js";import"./WarningPanel-DrLC6u8B.js";import"./MarkdownContent-u_spSNfd.js";import"./CodeSnippet-D0jouXxL.js";import"./Box-8SFFKrct.js";import"./styled-B2hRU9Pw.js";import"./CopyTextButton-CpIDND41.js";import"./useCopyToClipboard-DsqKZmF6.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";import"./List-mWa-4ocl.js";import"./ListContext-Cn7bnyCl.js";import"./ListItem-Dwvy6ya2.js";import"./ListItemText-BtoENYOw.js";import"./LinkButton-yeg5JieK.js";import"./Link-Cd-y_3kz.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BqO5cyWU.js";import"./Divider-DgNlfm7L.js";import"./CardActions-BUmLQ9hm.js";import"./BottomLink-DsmJq7Bq.js";import"./ArrowForward-BWgfYpnj.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
