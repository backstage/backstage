import{j as o}from"./iframe-DGs96NRX.js";import{c as e}from"./plugin-DhChxGdP.js";import{S as l}from"./Grid-BHZNDkgf.js";import{C as m}from"./ComponentAccordion-9Pw0Sx5s.js";import{w as a}from"./appWrappers-Dk3b9LWk.js";import{T as i}from"./TemplateBackstageLogoIcon-DhlxOXWv.js";import{I as s}from"./InfoCard-CVq5vFZI.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D2IBlZ3_.js";import"./componentData-DWCQSrQj.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./useRouteRef-XG42dmXR.js";import"./index-Du2IYsJS.js";import"./DialogTitle-BKLIXxRc.js";import"./Modal-BddTY979.js";import"./Portal-d4IyiHDj.js";import"./Backdrop-DikSmCJp.js";import"./Button-Nle0L9Fl.js";import"./useObservable-DHsdD1qc.js";import"./useIsomorphicLayoutEffect-CVR0SjCS.js";import"./ExpandMore-sv7y42DS.js";import"./AccordionDetails-DcDYdNfQ.js";import"./index-DnL3XN75.js";import"./Collapse-B15AMTul.js";import"./useAsync-Bl5kKHyn.js";import"./useMountedState-CrWRPmTB.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-D_Z8OSfu.js";import"./ErrorBoundary-Dc-3W-6w.js";import"./ErrorPanel-CNmGi6XN.js";import"./WarningPanel-Ci1uty-p.js";import"./MarkdownContent-BL9CdgAN.js";import"./CodeSnippet-_eOoFouG.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./CopyTextButton-BnG0iIPf.js";import"./useCopyToClipboard-CMVqWLvJ.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./ListItem-B6WkBU7i.js";import"./ListItemText-DKlzuA8v.js";import"./LinkButton-IIcYw6pZ.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DEMtBZ-P.js";import"./Divider-D5eOEnUc.js";import"./CardActions-BH_5asRW.js";import"./BottomLink-V5hYwYd7.js";import"./ArrowForward-D58oRGFf.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
