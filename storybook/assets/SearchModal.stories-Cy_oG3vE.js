import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DGs96NRX.js";import{r as x}from"./plugin-DH34O9We.js";import{S as m,u as n,a as S}from"./useSearchModal-Yl7DG50m.js";import{B as c}from"./Button-Nle0L9Fl.js";import{a as f,b as M,c as j}from"./DialogTitle-BKLIXxRc.js";import{B as C}from"./Box-D4WzEFhv.js";import{S as r}from"./Grid-BHZNDkgf.js";import{S as y}from"./SearchType-D8y7-fh3.js";import{L as I}from"./List-6sBN0fEc.js";import{H as R}from"./DefaultResultListItem-BZCWH1_S.js";import{s as B,M as D}from"./api-CANwXgMk.js";import{S as T}from"./SearchContext-CEYlV7VO.js";import{w as k}from"./appWrappers-Dk3b9LWk.js";import{SearchBar as v}from"./SearchBar-CneT1BL3.js";import{a as b}from"./SearchResult-C6xVoBh7.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CWyzElHM.js";import"./Plugin-D2IBlZ3_.js";import"./componentData-DWCQSrQj.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./useRouteRef-XG42dmXR.js";import"./index-Du2IYsJS.js";import"./ArrowForward-D58oRGFf.js";import"./translation-CQEV5Tde.js";import"./Page-CkheYHtX.js";import"./useMediaQuery-DWWePGjr.js";import"./Divider-D5eOEnUc.js";import"./ArrowBackIos-csSIrQZx.js";import"./ArrowForwardIos-CVLFjAP4.js";import"./translation-Ba3VP6-l.js";import"./Modal-BddTY979.js";import"./Portal-d4IyiHDj.js";import"./Backdrop-DikSmCJp.js";import"./styled-BpF5KOwn.js";import"./ExpandMore-sv7y42DS.js";import"./useAsync-Bl5kKHyn.js";import"./useMountedState-CrWRPmTB.js";import"./AccordionDetails-DcDYdNfQ.js";import"./index-DnL3XN75.js";import"./Collapse-B15AMTul.js";import"./ListItem-B6WkBU7i.js";import"./ListContext-JUKi6eaD.js";import"./ListItemIcon-CcQx7ihv.js";import"./ListItemText-DKlzuA8v.js";import"./Tabs-CePWFp-K.js";import"./KeyboardArrowRight-GaS27D3z.js";import"./FormLabel-DsqQygb-.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BWzqBC8C.js";import"./InputLabel-euruMf4a.js";import"./Select-Dtv3Xfot.js";import"./Popover-Cyvu5YOR.js";import"./MenuItem-D1l_ume9.js";import"./Checkbox-B4cMNjF1.js";import"./SwitchBase-BQ_cAT6J.js";import"./Chip-Bujycm77.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DHsdD1qc.js";import"./useIsomorphicLayoutEffect-CVR0SjCS.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DyZDiVgU.js";import"./useDebounce-KCT5KOyE.js";import"./InputAdornment-C6cuhZmU.js";import"./TextField-DbQomu9p.js";import"./useElementFilter-YIzP_I7o.js";import"./EmptyState-C0SpWLJr.js";import"./Progress-G8J7q6j9.js";import"./LinearProgress-tPe4r5gr.js";import"./ResponseErrorPanel-wWtNLXJs.js";import"./ErrorPanel-CNmGi6XN.js";import"./WarningPanel-Ci1uty-p.js";import"./MarkdownContent-BL9CdgAN.js";import"./CodeSnippet-_eOoFouG.js";import"./CopyTextButton-BnG0iIPf.js";import"./useCopyToClipboard-CMVqWLvJ.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
