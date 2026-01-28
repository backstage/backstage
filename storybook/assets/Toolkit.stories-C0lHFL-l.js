import{j as o}from"./iframe-B9hgvJLw.js";import{c as e}from"./plugin-BFj5CARM.js";import{S as l}from"./Grid-g3HyMBvJ.js";import{C as m}from"./ComponentAccordion-D6berDZg.js";import{w as a}from"./appWrappers-Du9InaF6.js";import{T as i}from"./TemplateBackstageLogoIcon-BAR-D6_n.js";import{I as s}from"./InfoCard-B0o9NPld.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D-bM_T9Q.js";import"./componentData-BIeygeYY.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./useRouteRef-nNeqZu86.js";import"./index-CsGVCGL2.js";import"./DialogTitle-D9yo_Iy-.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./Backdrop-BmcNn5D8.js";import"./Button-D3LDd96-.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./ExpandMore-BoLpzv6N.js";import"./AccordionDetails-CKakyLf0.js";import"./index-B9sM2jn7.js";import"./Collapse-FgK-KUTI.js";import"./useAsync-y2hE-c2R.js";import"./useMountedState-kHvlJXnr.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-AsNKMLjW.js";import"./ErrorBoundary-C7aCcvr1.js";import"./ErrorPanel-CtYawyCD.js";import"./WarningPanel-CWYhx9r2.js";import"./MarkdownContent-B8lxAtZu.js";import"./CodeSnippet-BVb_NoMX.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./CopyTextButton-DAUaMyUM.js";import"./useCopyToClipboard-D14CO7yh.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./ListItem-Bp1BuLev.js";import"./ListItemText-Bx_jgiBv.js";import"./LinkButton-DcZ0v-pe.js";import"./Link-C9X-RXqH.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DiDbXSwI.js";import"./Divider-CdNlJD_Q.js";import"./CardActions-i3yuXfwJ.js";import"./BottomLink-CIhQcQIt.js";import"./ArrowForward-CIWVdsJM.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
