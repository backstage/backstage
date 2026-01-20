import{j as o}from"./iframe-BOihsBca.js";import{c as e}from"./plugin-BOMnHvz4.js";import{S as l}from"./Grid-1tirjwRV.js";import{C as m}from"./ComponentAccordion-DdnS7CjY.js";import{w as a}from"./appWrappers-DK15oPID.js";import{T as i}from"./TemplateBackstageLogoIcon-CyaCOmrS.js";import{I as s}from"./InfoCard-CjT_VVPA.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BAjUdbN7.js";import"./componentData-TxEje_0q.js";import"./useAnalytics-DhOW7dTn.js";import"./useApp-BZBzLwEw.js";import"./useRouteRef-C2F4nlr5.js";import"./index-D4IyxNBc.js";import"./DialogTitle-CjKWEdsz.js";import"./Modal-jgY3Cn8t.js";import"./Portal-B8qEj_11.js";import"./Backdrop-Cv_Xkr3N.js";import"./Button-GN2E3NYf.js";import"./useObservable-C0lzDriu.js";import"./useIsomorphicLayoutEffect-DIFcbIH0.js";import"./ExpandMore-CS5zzKrc.js";import"./AccordionDetails-22y-25Aw.js";import"./index-B9sM2jn7.js";import"./Collapse-I_wLTjeF.js";import"./useAsync-DYwiSXoB.js";import"./useMountedState-BkgXJbA1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B5NTKqYg.js";import"./ErrorBoundary-CUIgcsCK.js";import"./ErrorPanel-NVtD5Fmz.js";import"./WarningPanel-CphllhCv.js";import"./MarkdownContent-UpORQ4pi.js";import"./CodeSnippet-KsTffiAQ.js";import"./Box-CI5GVXvc.js";import"./styled-DdU_wQet.js";import"./CopyTextButton-D9S96eUG.js";import"./useCopyToClipboard-VRQ5LG6h.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./ListItem-CxNFHnwj.js";import"./ListItemText-7EMyhNXk.js";import"./LinkButton-B1OFknhl.js";import"./Link-Cl4hSzOR.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BfS5-4YN.js";import"./Divider-YwFpIHuT.js";import"./CardActions-Bs5c7L4W.js";import"./BottomLink-CXH5t2pM.js";import"./ArrowForward-DCIpWazW.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
