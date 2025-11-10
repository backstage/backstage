import{j as t,m as d,I as u,b as h,T as g}from"./iframe-cIBAsfTm.js";import{r as x}from"./plugin-JnCPotEe.js";import{S as m,u as n,a as S}from"./useSearchModal-5B-xkh6l.js";import{B as c}from"./Button-D8Pwv3bO.js";import{a as f,b as M,c as j}from"./DialogTitle-DpcONI-S.js";import{B as C}from"./Box-5_AhqNAq.js";import{S as r}from"./Grid-Dgo5ACik.js";import{S as y}from"./SearchType-7wNMDk83.js";import{L as I}from"./List-BJcgiIVB.js";import{H as R}from"./DefaultResultListItem-BWizRZj9.js";import{s as B,M as D}from"./api-FGhT9qVs.js";import{S as T}from"./SearchContext-KUHwwAnu.js";import{w as k}from"./appWrappers-C9lQTpTI.js";import{SearchBar as v}from"./SearchBar-DgMjoc-W.js";import{a as b}from"./SearchResult-DvYAoxiD.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CX3Nd5GQ.js";import"./Plugin-CWbQlcVn.js";import"./componentData-DBqEb6G1.js";import"./useAnalytics-Cn11G-Da.js";import"./useApp-BnMckP-G.js";import"./useRouteRef-tsZqa-xk.js";import"./index-BkxQC8j2.js";import"./ArrowForward-Hao0JHUH.js";import"./translation-CJSbrCM9.js";import"./Page-CBdTr0ab.js";import"./useMediaQuery-D4ZwO_FM.js";import"./Divider-Cpot2Ubt.js";import"./ArrowBackIos-CwXudgSS.js";import"./ArrowForwardIos-CnO_Q3NY.js";import"./translation-D_KkFuqr.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./Backdrop-BVSi2zmG.js";import"./styled-6iTZXECK.js";import"./ExpandMore-Fefrqwki.js";import"./useAsync-DPpw4t_L.js";import"./useMountedState-DDQ1veKw.js";import"./AccordionDetails-DeQbQa7K.js";import"./index-DnL3XN75.js";import"./Collapse-BkfRpfT3.js";import"./ListItem-DDKzfBu6.js";import"./ListContext-CvDEkeuW.js";import"./ListItemIcon-MZjq3RFx.js";import"./ListItemText-CP0ZRpAu.js";import"./Tabs-r35qRNvI.js";import"./KeyboardArrowRight-h3J2i1_s.js";import"./FormLabel-DmnX46Bz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DpGllqyr.js";import"./InputLabel-C0VpW_02.js";import"./Select-BfkLSqHW.js";import"./Popover-BkYTo63x.js";import"./MenuItem-C7RX92pZ.js";import"./Checkbox-DFnPJHFV.js";import"./SwitchBase-DuMfNZYh.js";import"./Chip-D5tGryFv.js";import"./Link-BTtSeEzC.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-5q0VJedC.js";import"./useIsomorphicLayoutEffect-nJ3cOO7G.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DRcZQLgp.js";import"./useDebounce-lzWhidG9.js";import"./InputAdornment-CyJIuY0o.js";import"./TextField-D0FZ420g.js";import"./useElementFilter-B-xdHB-z.js";import"./EmptyState-CXY2O3DS.js";import"./Progress-CjkEnN9C.js";import"./LinearProgress-BCefwoaA.js";import"./ResponseErrorPanel-Cony3Tjj.js";import"./ErrorPanel-BVO-icJS.js";import"./WarningPanel-DCLMi1dI.js";import"./MarkdownContent-CaLyrJfC.js";import"./CodeSnippet-kFMDpIw3.js";import"./CopyTextButton-Dc9zjtfe.js";import"./useCopyToClipboard-B_-Fejqp.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
