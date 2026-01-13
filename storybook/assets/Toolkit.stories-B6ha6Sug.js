import{j as o}from"./iframe-DFN6SAj3.js";import{c as e}from"./plugin-DM50B3FE.js";import{S as l}from"./Grid-CnDsPTZJ.js";import{C as m}from"./ComponentAccordion-d3sgPfeE.js";import{w as a}from"./appWrappers-Ctv9hZvN.js";import{T as i}from"./TemplateBackstageLogoIcon-CnWC8Pfd.js";import{I as s}from"./InfoCard-BgV_KJQF.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D6woGNMR.js";import"./componentData-BPXI-FVd.js";import"./useAnalytics-B9OoIKEa.js";import"./useApp-B_iVMZKS.js";import"./useRouteRef-CsRrhzNw.js";import"./index-BUG12Py2.js";import"./DialogTitle-CELxYlfT.js";import"./Modal-B95o4eGb.js";import"./Portal-6-SOUMqq.js";import"./Backdrop-CFExy8rC.js";import"./Button-DZ6ggl2r.js";import"./useObservable-HXm7xrFW.js";import"./useIsomorphicLayoutEffect-DE10RVz8.js";import"./ExpandMore-Baqg86ni.js";import"./AccordionDetails-BCiojWwT.js";import"./index-B9sM2jn7.js";import"./Collapse-Dmxu6_xf.js";import"./useAsync-Aw_hIc9t.js";import"./useMountedState-0rCkRX95.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Cdt1ySKT.js";import"./ErrorBoundary-C26hs5Ah.js";import"./ErrorPanel-DGkagluo.js";import"./WarningPanel-CcjMMskt.js";import"./MarkdownContent-C7YoEea1.js";import"./CodeSnippet-DP1ZDnW-.js";import"./Box-CrX2Agh3.js";import"./styled-UJWvm5Ja.js";import"./CopyTextButton-bz5fwOjo.js";import"./useCopyToClipboard-S8C7f3cV.js";import"./Tooltip-B6ATafnk.js";import"./Popper-BPOHrmiw.js";import"./List-CNrJvNp3.js";import"./ListContext-B6gycCKe.js";import"./ListItem-khPUul4I.js";import"./ListItemText-CEkrmQrS.js";import"./LinkButton-BrLVtOkM.js";import"./Link-DZVnE3x4.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CDDCJ9fq.js";import"./Divider-C4fHH6xB.js";import"./CardActions-CeC0kwcP.js";import"./BottomLink-BR0unUwa.js";import"./ArrowForward-DrIDPrkh.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
