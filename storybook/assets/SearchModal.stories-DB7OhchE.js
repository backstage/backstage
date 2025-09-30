import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Bqhsa6Sh.js";import{r as x}from"./plugin-ByQXhup_.js";import{S as m,u as n,a as S}from"./useSearchModal-C9Sy_H38.js";import{B as c}from"./Button-BIWqIjhL.js";import{a as f,b as M,c as j}from"./DialogTitle-CWvQ0e48.js";import{B as C}from"./Box-7oeyrs_b.js";import{S as r}from"./Grid-B6o2V4N5.js";import{S as y}from"./SearchType-DjPTpvgG.js";import{L as I}from"./List-DhlESJBF.js";import{H as R}from"./DefaultResultListItem-DsQVXEFO.js";import{s as B,M as D}from"./api-D4PYsrzF.js";import{S as T}from"./SearchContext-BS1y7RRC.js";import{w as k}from"./appWrappers-DpSGCgYr.js";import{SearchBar as v}from"./SearchBar-B7m-G4fw.js";import{a as b}from"./SearchResult-QCQ2rg6A.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BnR6moq1.js";import"./Plugin-ChbcFySR.js";import"./componentData-BjQGtouP.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./useRouteRef-D2qGziGj.js";import"./index-C3od-xDV.js";import"./ArrowForward-o-fAnTPb.js";import"./translation-DQ_umtgn.js";import"./Page-7Oa-4ED0.js";import"./useMediaQuery-BFRIwwZI.js";import"./Divider-dXncAHZ6.js";import"./ArrowBackIos-aX4Z_e6Z.js";import"./ArrowForwardIos-Cv_D9OM-.js";import"./translation-BgUdvrgD.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./Backdrop-jgSEnQhj.js";import"./styled-PHRrol5o.js";import"./ExpandMore-DtBTikql.js";import"./useAsync-CZ1-XOrU.js";import"./useMountedState-By8QTQnS.js";import"./AccordionDetails-TLAxJNrY.js";import"./index-DnL3XN75.js";import"./Collapse-BmcxTB9C.js";import"./ListItem-BUcGiLuR.js";import"./ListContext-42q0jwAr.js";import"./ListItemIcon-BhW7GlzU.js";import"./ListItemText-CHn-6MvY.js";import"./Tabs-8ygkkaF2.js";import"./KeyboardArrowRight-B6of3WUS.js";import"./FormLabel-BImBqquF.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-kpRDOPzl.js";import"./InputLabel-BgWhd402.js";import"./Select-DTWqy7D7.js";import"./Popover-CV1Qmkiv.js";import"./MenuItem-Cleq8U4u.js";import"./Checkbox-bSiraUkG.js";import"./SwitchBase-BtaiWWHu.js";import"./Chip-DzKR1Dft.js";import"./Link-BYO-u9Rv.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BiPsRSo_.js";import"./useDebounce-DuZS8oZp.js";import"./InputAdornment-Afgn6J1P.js";import"./TextField-ckbFLGKy.js";import"./useElementFilter-CLYkkZuN.js";import"./EmptyState-Bjc6Ro8g.js";import"./Progress-7e6Cpbjg.js";import"./LinearProgress-DIlkpeqy.js";import"./ResponseErrorPanel-DbfW4iRR.js";import"./ErrorPanel-DjMQdfdJ.js";import"./WarningPanel-ChwZGoqa.js";import"./MarkdownContent-NPwWt_6a.js";import"./CodeSnippet-668TY6_y.js";import"./CopyTextButton-BbR5f8cw.js";import"./useCopyToClipboard-Cacc49O7.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
