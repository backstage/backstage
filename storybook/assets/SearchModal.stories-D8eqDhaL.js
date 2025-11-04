import{j as t,m as d,I as u,b as h,T as g}from"./iframe-CuO26Rmv.js";import{r as x}from"./plugin-STdCG4P5.js";import{S as m,u as n,a as S}from"./useSearchModal-DQ-hBuAw.js";import{B as c}from"./Button-DlZ0BBap.js";import{a as f,b as M,c as j}from"./DialogTitle-HF8aA2AY.js";import{B as C}from"./Box-CU-U4ibu.js";import{S as r}from"./Grid-BfYuvVEF.js";import{S as y}from"./SearchType-CWh8U2cL.js";import{L as I}from"./List-BAIPzTEx.js";import{H as R}from"./DefaultResultListItem-B3y0Po4P.js";import{s as B,M as D}from"./api-CB8z8LCt.js";import{S as T}from"./SearchContext-BSgFofDu.js";import{w as k}from"./appWrappers-CqMB6nNx.js";import{SearchBar as v}from"./SearchBar-5KZ2mxd1.js";import{a as b}from"./SearchResult-BEhNWo9b.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CstkzreT.js";import"./Plugin-BYJQvkSS.js";import"./componentData-jPnjY360.js";import"./useAnalytics-CdEHywY9.js";import"./useApp-BYLVa0iu.js";import"./useRouteRef-DasU4rh5.js";import"./index-CA92LH--.js";import"./ArrowForward-BT_Xitdy.js";import"./translation-CBjHsALp.js";import"./Page-2-O3scU7.js";import"./useMediaQuery-DbvZc6lp.js";import"./Divider-vqslFKyv.js";import"./ArrowBackIos-Dybw5f5w.js";import"./ArrowForwardIos-Au_JaEK4.js";import"./translation-5fNVYynF.js";import"./Modal-6Ajkd_zG.js";import"./Portal-BcfglCa0.js";import"./Backdrop-BlG2t9Br.js";import"./styled-C8K_EIFt.js";import"./ExpandMore-BXwwuksY.js";import"./useAsync-CNdJisKf.js";import"./useMountedState-Cwi1zouP.js";import"./AccordionDetails-C3hb9ppk.js";import"./index-DnL3XN75.js";import"./Collapse-BQbZuamb.js";import"./ListItem-D5_amKXt.js";import"./ListContext-0ULPV768.js";import"./ListItemIcon-AqQKWWgx.js";import"./ListItemText-CSVSzb3y.js";import"./Tabs-CuOQbaaO.js";import"./KeyboardArrowRight-CyaJnZRA.js";import"./FormLabel-BPUD3WYf.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-4cz9UsBa.js";import"./InputLabel-C2uVXjpH.js";import"./Select-B1wLy_1E.js";import"./Popover-qvG1tW29.js";import"./MenuItem-BoCgrpVQ.js";import"./Checkbox-4kToOhkw.js";import"./SwitchBase-BwvdzWWy.js";import"./Chip-D-EBFjTQ.js";import"./Link-DPuqs8WZ.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-CW3YJiyR.js";import"./useIsomorphicLayoutEffect-B9jQ_lJC.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Ctc2bIOi.js";import"./useDebounce-CcBb1GHu.js";import"./InputAdornment-Cjbc403m.js";import"./TextField-BEz1rSAB.js";import"./useElementFilter-DUH5wCei.js";import"./EmptyState-C48d_rWe.js";import"./Progress-CFwsUMPR.js";import"./LinearProgress-CNTdMoKg.js";import"./ResponseErrorPanel-FjpBoU-3.js";import"./ErrorPanel-CDwA38MB.js";import"./WarningPanel-DSWSSSeS.js";import"./MarkdownContent-Dnni9t_T.js";import"./CodeSnippet-jcNnShuM.js";import"./CopyTextButton-BNZ4H3Xn.js";import"./useCopyToClipboard-BtizGtOb.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
