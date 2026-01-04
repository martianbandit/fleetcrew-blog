export SCHEDULED_TASK_API_KEY="sk-YVOu-NTbpIUjsphqmRUSAMJAtvVGzw1tU4Q5-gfwzbv_04ZGuxGJB0EyH-I71_nyCQE0_owWsYsUDclwfVKzjSEFN-en"
BASE_URL="https://fleetblog.manus.space"

echo "== health ==" && curl -sS "$BASE_URL/api/health" && echo

echo "== create draft ==" 
CREATE=$(curl -sS -X POST "$BASE_URL/api/articles/create" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $SCHEDULED_TASK_API_KEY" \
  -d '{
    "title":"CANARY Publish Test",
    "content":"## Test\n\nSi tu lis ça, ça publie.\n\n- https://fleetparts.manus.space/\n- https://fleetcrew-kb75upsk.manus.space\n- https://8xhpiqcen0qp.manus.space\n",
    "categorySlug":"actualites",
    "generateCoverImage":false,
    "status":"draft"
  }')
echo "$CREATE" | head -c 400; echo

ID=$(echo "$CREATE" | sed -n 's/.*"id":[ ]*\([0-9]\+\).*/\1/p' | head -n 1)
URL=$(echo "$CREATE" | sed -n 's/.*"url":[ ]*"\([^"]\+\)".*/\1/p' | head -n 1)

echo "== publish ==" 
curl -sS -X PATCH "$BASE_URL/api/articles/$ID/publish" \
  -H "X-API-Key: $SCHEDULED_TASK_API_KEY" | head -c 400; echo

echo "== public check (retry) ==" 
for i in {1..10}; do
  CODE=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL$URL" || true)
  echo "Try #$i => HTTP $CODE"
  if [ "$CODE" = "200" ]; then
    echo "✅ PUBLIÉ: $BASE_URL$URL"
    exit 0
  fi
  sleep 2
done

echo "❌ Créé/publish côté API mais pas accessible publiquement: $BASE_URL$URL"
exit 1
