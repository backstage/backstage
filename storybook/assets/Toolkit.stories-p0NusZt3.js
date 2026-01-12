import{j as o}from"./iframe-C8yOC2Gz.js";import{c as e}from"./plugin-C5Nls2ei.js";import{S as l}from"./Grid-CFxNiZTj.js";import{C as m}from"./ComponentAccordion-pQVGyY5D.js";import{w as a}from"./appWrappers-BwqhmqR7.js";import{T as i}from"./TemplateBackstageLogoIcon-D2K--lAv.js";import{I as s}from"./InfoCard-NdZuYaRN.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BKrfKbSW.js";import"./componentData-BzMhRHzP.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./useRouteRef-Csph2kF6.js";import"./index-CL1m9NR9.js";import"./DialogTitle-BkYEluNi.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./Backdrop-CgVSzXAJ.js";import"./Button-BKAaE2BP.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./ExpandMore-DevN-S2O.js";import"./AccordionDetails-ClHZ_AqU.js";import"./index-B9sM2jn7.js";import"./Collapse-BMBJHt31.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BTwSHN8c.js";import"./ErrorBoundary-BZIgoJeC.js";import"./ErrorPanel-C1UVhDOE.js";import"./WarningPanel-k1eYB_NT.js";import"./MarkdownContent-C9TrxeVt.js";import"./CodeSnippet-CcjaZ8oG.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./CopyTextButton-BJf8FGQ0.js";import"./useCopyToClipboard-Cdth3J8w.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./ListItem-BMFOx_2Q.js";import"./ListItemText-CyJt0pMj.js";import"./LinkButton-B4FRoGfy.js";import"./Link-CUs49TGY.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CK7GWSaa.js";import"./Divider-9e41O7nq.js";import"./CardActions-DjE-ZFS5.js";import"./BottomLink-hnT-aCrJ.js";import"./ArrowForward-CyzdqpLN.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
