import re
from typing import Dict, Any, List


def analyze_build(components: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes PC build components for compatibility, balance, and performance.
    """
    warnings: List[str] = []
    recommendations: List[str] = []

    cpu = components.get("cpu") or components.get("CPU")
    gpu = components.get("gpu") or components.get("GPU")
    ram = components.get("ram") or components.get("RAM")
    mb = components.get("motherboard") or components.get("Motherboard")
    psu = components.get("psu") or components.get("PSU")
    ssd = components.get("ssd") or components.get("SSD")
    case = components.get("case") or components.get("Case")

    score = 9.0

    # 1. Socket compatibility (CPU vs Motherboard)
    if cpu and mb:
        cpu_name = (cpu.get("name") or "") + " " + (cpu.get("chipset") or "")
        mb_specs = (mb.get("name") or "") + " " + (mb.get("chipset") or "") + " " + (mb.get("specs") or "")

        # Intel LGA1700 check
        if any(x in cpu_name for x in ["12", "13", "14"]) and "Intel" in (cpu.get("brand") or ""):
            if "AM4" in mb_specs or "AM5" in mb_specs:
                warnings.append("Несовместимость сокета! Процессор Intel LGA1700 не подходит к плате AMD (AM4/AM5).")
                score -= 3.0

        # AMD AM4 / AM5 check
        if "Ryzen" in cpu_name:
            if any(x in cpu_name for x in ["7000", "8000", "9000", "7600", "7700", "7800", "7900", "7950"]):
                # AM5 CPU
                if "AM4" in mb_specs or "B550" in mb_specs or "X570" in mb_specs:
                    warnings.append("Несовместимость! Процессор Ryzen серии 7000+ требует плату сокета AM5 (B650/X670), а выбрана AM4.")
                    score -= 3.0
            elif any(x in cpu_name for x in ["3000", "5000", "5600", "5700", "5800"]):
                # AM4 CPU
                if "AM5" in mb_specs or "B650" in mb_specs or "X670" in mb_specs:
                    warnings.append("Несовместимость! Процессор сокета AM4 не подходит к материнской плате сокета AM5.")
                    score -= 3.0

    # 2. RAM vs Motherboard compatibility (DDR4 vs DDR5)
    if ram and mb:
        ram_text = (ram.get("name") or "") + " " + (ram.get("specs") or "")
        mb_text = (mb.get("name") or "") + " " + (mb.get("specs") or "")

        ram_is_ddr4 = "DDR4" in ram_text.upper()
        ram_is_ddr5 = "DDR5" in ram_text.upper()
        mb_is_ddr4 = "DDR4" in mb_text.upper()
        mb_is_ddr5 = "DDR5" in mb_text.upper()

        if ram_is_ddr4 and mb_is_ddr5 and not mb_is_ddr4:
            warnings.append("Несовместимость оперативной памяти: плата поддерживает только DDR5, а выбрана DDR4.")
            score -= 2.5
        elif ram_is_ddr5 and mb_is_ddr4 and not mb_is_ddr5:
            warnings.append("Несовместимость оперативной памяти: плата поддерживает только DDR4, а выбрана DDR5.")
            score -= 2.5

    # 3. PSU Wattage calculation
    estimated_wattage = 100  # Base motherboard, fans, storage
    if cpu:
        cpu_str = (cpu.get("name") or "").lower()
        if "i9" in cpu_str or "7950" in cpu_str or "13900" in cpu_str:
            estimated_wattage += 250
        elif "i7" in cpu_str or "7700" in cpu_str or "13700" in cpu_str:
            estimated_wattage += 200
        else:
            estimated_wattage += 120

    if gpu:
        gpu_str = (gpu.get("name") or "").lower()
        if "4090" in gpu_str:
            estimated_wattage += 450
        elif "4080" in gpu_str or "7900" in gpu_str:
            estimated_wattage += 350
        elif "4070" in gpu_str or "7800" in gpu_str:
            estimated_wattage += 250
        elif "4060" in gpu_str or "7600" in gpu_str:
            estimated_wattage += 160
        else:
            estimated_wattage += 180

    if psu:
        psu_text = (psu.get("name") or "") + " " + (psu.get("specs") or "")
        psu_match = re.search(r"(\d{3,4})\s*W", psu_text, re.IGNORECASE)
        if psu_match:
            psu_watts = int(psu_match.group(1))
            recommended_watts = estimated_wattage + 150  # 150W headroom
            if psu_watts < estimated_wattage:
                warnings.append(f"Критично! Блок питания ({psu_watts}W) слабее расчетного потребления ({estimated_wattage}W). ПК может выключаться при нагрузке.")
                score -= 3.0
            elif psu_watts < recommended_watts:
                recommendations.append(f"Рекомендуется блок питания мощностью от {recommended_watts}W для надежного запаса.")
                score -= 0.5

    # 4. Storage check
    if not ssd:
        recommendations.append("Добавьте быстрый NVMe SSD для быстрой загрузки системы и игр.")
        score -= 0.5

    # 5. Missing critical components
    missing = []
    if not cpu:
        missing.append("процессор (CPU)")
    if not gpu:
        missing.append("видеокарта (GPU)")
    if not ram:
        missing.append("оперативная память (RAM)")
    if not mb:
        missing.append("материнская плата (Motherboard)")
    if not psu:
        missing.append("блок питания (PSU)")

    if missing:
        warnings.append(f"В сборке отсутствуют ключевые компоненты: {', '.join(missing)}.")
        score -= 1.0 * len(missing)

    score = max(1.0, min(10.0, round(score, 1)))

    if not recommendations:
        recommendations.append("Сборка сбалансирована, компоненты гармонично сочетаются.")
        recommendations.append("Не забудьте про хорошую термопасту и продуваемый корпус.")

    # Determine balance and use cases
    if score >= 8.5:
        balance = "Отличная сбалансированность. Комплектующие идеально подходят друг к другу без явных «узких мест» (bottleneck)."
        overall = "Сбалансированная и высокопроизводительная сборка высокого уровня."
        use_cases = "Гейминг в 1440p / 4K на максимальных настройках, стриминг, видеомонтаж и 3D-моделирование."
    elif score >= 6.5:
        balance = "Хороший баланс с небольшими возможностями для оптимизации."
        overall = "Работоспособная конфигурация, готовая к повседневным задачам и современным играм."
        use_cases = "Комфортный гейминг в 1080p / 1440p, работа с графикой и мультимедиа."
    else:
        balance = "Обнаружены конфликты совместимости или несбалансированное соотношение мощности компонентов."
        overall = "Требуется корректировка компонентов перед покупкой и сборкой."
        use_cases = "Перед сборкой рекомендуется устранить предупреждения совместимости."

    return {
        "score": score,
        "overallAssessment": overall,
        "balance": balance,
        "recommendations": recommendations,
        "warnings": warnings,
        "useCases": use_cases
    }
