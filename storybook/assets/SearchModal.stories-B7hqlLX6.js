import{j as t,m as d,I as u,b as h,T as g}from"./iframe-CA0Xqitl.js";import{r as x}from"./plugin-BsbL5fQk.js";import{S as m,u as n,a as S}from"./useSearchModal-DMVeKjp7.js";import{B as c}from"./Button-CbaUxuKj.js";import{a as f,b as M,c as j}from"./DialogTitle-COZeQRP2.js";import{B as C}from"./Box-Ds7zC8BR.js";import{S as r}from"./Grid-B8o7JoCY.js";import{S as y}from"./SearchType-DPg_roo6.js";import{L as I}from"./List-BnsnRWJY.js";import{H as R}from"./DefaultResultListItem-DIBfAygS.js";import{s as B,M as D}from"./api-Bb3c_gWr.js";import{S as T}from"./SearchContext-Bger8GSm.js";import{w as k}from"./appWrappers-OMKuIXpb.js";import{SearchBar as v}from"./SearchBar-BsZsNPgh.js";import{a as b}from"./SearchResult-5O8X0i7D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cbylfjtp.js";import"./Plugin-CwlDf1Ud.js";import"./componentData-CdEqgOPk.js";import"./useAnalytics-Bs3aHlE6.js";import"./useApp-DFdkDp9A.js";import"./useRouteRef-DoEb129Q.js";import"./index-ByTVIOef.js";import"./ArrowForward-Di5ER0Ic.js";import"./translation-DVeYHsEY.js";import"./Page--fSqIHhR.js";import"./useMediaQuery-BpBnXgQY.js";import"./Divider-Dil931lt.js";import"./ArrowBackIos-Clbcg8DD.js";import"./ArrowForwardIos-CmZcVgo9.js";import"./translation-CsXbzASl.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./Backdrop-Cdn7d1XZ.js";import"./styled-BOzNBejn.js";import"./ExpandMore-DfKPiaDM.js";import"./useAsync-BGwS6Vz2.js";import"./useMountedState-zGQsXHvo.js";import"./AccordionDetails-BewnNYiP.js";import"./index-B9sM2jn7.js";import"./Collapse-BpZh4zHv.js";import"./ListItem-BzxviKme.js";import"./ListContext-TMUZkd5u.js";import"./ListItemIcon-Ck7nypoA.js";import"./ListItemText-BwZgc58h.js";import"./Tabs-fmL5FU6v.js";import"./KeyboardArrowRight-CWYtNh_d.js";import"./FormLabel-B3GaXop_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BujB911u.js";import"./InputLabel--gwgFf8r.js";import"./Select-DNkSp5Jx.js";import"./Popover-BmPtjFBs.js";import"./MenuItem--GQa4AVk.js";import"./Checkbox-DCnPGni0.js";import"./SwitchBase-B3jb_k_h.js";import"./Chip-JwuTVm3o.js";import"./Link-D1vtE7Ac.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-DY424ZJv.js";import"./useIsomorphicLayoutEffect-rHGqqG8J.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Q60sSBLO.js";import"./useDebounce-Dz0QMytD.js";import"./InputAdornment-CgaIsSKk.js";import"./TextField-CbQKOlJB.js";import"./useElementFilter-BsNM8GTW.js";import"./EmptyState-D3AW8ss9.js";import"./Progress-BMXpV-Rn.js";import"./LinearProgress-Bwo2YJzI.js";import"./ResponseErrorPanel-C2DYRHB9.js";import"./ErrorPanel-xkUPraUn.js";import"./WarningPanel-DyFbjHtf.js";import"./MarkdownContent-CWjBFtdf.js";import"./CodeSnippet-BbCr73he.js";import"./CopyTextButton-Bm7dvK1x.js";import"./useCopyToClipboard-B8vbXgZE.js";import"./Tooltip-CuEp3aUv.js";import"./Popper-yvDUz_ZU.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
